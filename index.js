const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");
require('dotenv').config()

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

// some models require global server variables
const { Command } = require("./modules/player/commands.js");

const files = [];
const getFilesRecursively = directory => {
    const filesInDirectory = fs.readdirSync(directory);
    for(const file of filesInDirectory) {
        let absolute = path.join(directory, file);
        if(fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            files.push(absolute);
            let routePath = `/${path.relative("routing/client/", absolute)}`.replaceAll("\\", '/');
            app.get(routePath, (req, res) => {
                return res.sendFile(absolute, {
                    root: '.'
                });
            });
        }
    }
}
getFilesRecursively("./routing/client/");

app.get('/*', (req, res) => {
    if(req.params[0] == '') // to ignore requests related to img directory
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

        const updates = {};
        updates[`${chunkX},${chunkY}`] = chunkData;
        socket.emit("chunkLoaded", updates);
    });

    socket.on("protect", (value, chunkX, chunkY) => {
        chunkManager.set_protection(value, chunkX, chunkY);
    });

    socket.on("move", (x, y) => {
        client.x = x;
        client.y = y;

        socket.broadcast.emit("playerMoved", client.id, x, y);
    });

    socket.on("loadChunk", (loadQueue) => {
        const chunkDatas = {};
        
        for(let i in loadQueue) {
            const [x, y] = loadQueue[i];

            chunkDatas[`${x},${y}`] = chunkManager.getChunkData(client.world, x, y);
        };

        socket.emit("chunkLoaded", chunkDatas);
    });

    socket.on("send", (message) => {
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