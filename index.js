const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const Client = require("./modules/player/Client.js");
const chunkManager = require("./modules/world/chunkManager.js");
const textManager = require("./modules/world/textManager.js");
const lineManager = require("./modules/world/lineManager.js");

const config = require("./config.json");
const { getRankByID } = require("./modules/player/rankingUtils.js");

global.server = {
    worlds: [],
    config,
    env: process.env
}

// some modules require global server variables
const { Command } = require("./modules/player/commands.js");

const files = [];
const getFilesRecursively = function(directory) {
    const filesInDirectory = fs.readdirSync(directory);
    for(let i = 0; i < filesInDirectory.length; i++) {
        const file = filesInDirectory[i];
        let absolute = path.join(directory, file);
        if(fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            files.push(absolute);
            let routePath = '/' + path.relative("routing/client/", absolute).split(path.sep).join('/');
            app.get(routePath, function(req, res) {
                return res.sendFile(absolute, {
                    root: '.'
                });
            });
        }
    }
}
getFilesRecursively("./routing/client/");

// share important files with client
(function clientShare() {
    const srcPath = path.join(__dirname, "modules", "shared", "ranks.json");
    const destPath = path.join(__dirname, 'client-src', 'shared', "ranks.json");

    fs.copyFile(srcPath, destPath, (err) => {
        if (err) throw err;
    });
})();

app.get("/*", (req, res) => {
    if(req.params[0] == '') // ignore requests related to img directory
        return res.sendFile("./routing/client/index.html", {
            root: '.'
        });
});

io.on("connection", socket => {
    const client = new Client(socket);

    socket.broadcast.emit("playerJoin", client.id);

    socket.on("setPixel", (x, y, color) => {
        x = Math.floor(x);
        y = Math.floor(y);
        
        client.color = color;

        const chunkX = Math.floor(x / 16);
        const chunkY = Math.floor(y / 16);

        if(!getRankByID(client.rank).permissions.includes("protect") && chunkManager.get_protection(client.world, chunkX, chunkY) === true) return;
        if(config.saving.savePixels) chunkManager.set_pixel(client.world, x, y, color);

        socket.broadcast.emit("newPixel", x, y, color);
    });

    socket.on("setLine", (from, to) => {
        if(config.saving.saveLines) lineManager.draw_line(client.world, from, to);

        socket.broadcast.emit("newLine", from, to);
    });

    socket.on("setText", (text, x, y) => {
        if(config.saving.saveTexts) textManager.set_text(client.world, text, x, y);

        socket.broadcast.emit("newText", text, x, y);
    });

    socket.on("setChunk", (color, chunkX, chunkY) => {
        if(!getRankByID(client.rank).permissions.includes("erase")) return;

        const chunkData = chunkManager.set_rgb(client.world, chunkX, chunkY, color);
        const isProtected = chunkManager.get_protection(client.world, chunkX, chunkY);

        const updates = {};
        updates[`${chunkX},${chunkY}`] = { data: chunkData, protected: isProtected };
        socket.broadcast.emit("chunkLoaded", updates);
    });

    socket.on("setChunkData", (chunkX, chunkY, chunkData) => {
        if(!getRankByID(client.rank).permissions.includes("erase")) return;

        chunkManager.set_chunkdata(client.world, chunkX, chunkY, chunkData);
        const isProtected = chunkManager.get_protection(client.world, chunkX, chunkY);

        const updates = {};
        updates[`${chunkX},${chunkY}`] = { data: chunkData, protected: isProtected };
        socket.broadcast.emit("chunkLoaded", updates);
    });

    socket.on("protect", (value, chunkX, chunkY) => {
        if(!getRankByID(client.rank).permissions.includes("protect")) return;
        chunkManager.set_protection(client.world, chunkX, chunkY, value);
        socket.broadcast.emit("protectionUpdated", chunkX, chunkY, value);
    });

    socket.on("move", (x, y) => {
        client.x = x;
        client.y = y;

        socket.broadcast.emit("playerMoved", client.id, x, y);
    });

    socket.on("setTool", toolID => {
        client.tool = toolID;

        socket.broadcast.emit("playerUpdate", client.id, client.tool, client.color);
    });

    socket.on("loadChunk", (loadQueue) => {
        const chunkDatas = {};
        
        for(let i in loadQueue) {
            const [x, y] = loadQueue[i];

            chunkDatas[`${x},${y}`] = {
                data: chunkManager.get_chunkdata(client.world, x, y),
                protected: chunkManager.get_protection(client.world, x, y)
            }
        }

        socket.emit("chunkLoaded", chunkDatas);
    });

    socket.on("send", (message) => {
        if(!getRankByID(client.rank).permissions.includes("chat")) return;
        message = message.trim();
        if(message.startsWith('/')) {
            new Command(client, message);
            return;
        }

        socket.emit("message", `${client.id}: ${message}`);
        socket.broadcast.emit("message", `${client.id}: ${message}`);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("playerLeft", client.id);
    });
});

httpServer.listen(config.port, () => {
    console.log(`Server is running at *:${config.port}`);
});