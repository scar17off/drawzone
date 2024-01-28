const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const Client = require("./modules/player/Client.js");
const chunkManager = require("./modules/world/chunkManager.js");

const config = require("./config.json");

global.server = {
    worlds: [],
    config
}

const files = [];
const getFilesRecursively = directory => {
    const filesInDirectory = fs.readdirSync(directory);
    for(const file of filesInDirectory) {
        let absolute = path.join(directory, file);
        if(fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            files.push(absolute);
            let routePath = `/${path.relative("routing/client/", absolute)}`;
            app.get(routePath, (req, res) => {
                return res.sendFile(absolute, {
                    root: '.'
                })
            })
        }
    }
}
getFilesRecursively("./routing/client/");

app.get('/*', (req, res) => {
    return res.sendFile("./routing/client/index.html", {
        root: '.'
    })
})

io.on("connection", socket => {
    const client = new Client(socket);

    socket.broadcast.emit("playerJoin", client.id);

    socket.on("setPixel", (x, y, color) => {
        x = Math.floor(x);
        y = Math.floor(y);
        
        client.color = color;

        chunkManager.set_pixel(client.world, x, y, color);

        socket.broadcast.emit("newPixel", x, y, color);
    })

    socket.on("setLine", (from, to) => {
        socket.broadcast.emit("newLine", from, to);
    })

    socket.on("setText", (text, x, y) => {
        socket.broadcast.emit("newText", text, x, y);
    })

    socket.on("move", (x, y) => {
        client.x = x;
        client.y = y;

        socket.broadcast.emit("playerMoved", client.id, x, y);
    })

    socket.on("loadChunk", (loadQueue) => {
        const chunkDatas = {};
        
        for(let i in loadQueue) {
            const [x, y] = loadQueue[i];

            chunkDatas[`${x},${y}`] = chunkManager.getChunkData(client.world, x, y);
        };

        socket.emit("chunkLoaded", chunkDatas);
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit("playerLeft", client.id);
    })
})

httpServer.listen(config.port, () => {
    console.log(`Server is running at *:${config.port}`);
})