const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const chunkManager = require("./modules/world/chunkManager.js");
const Client = require("./modules/player/Client.js");

const config = require("./config.json");

global.server = {
    worlds: [],
    config
};

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
                });
            });
        };
    };
};
getFilesRecursively("./routing/client/");

app.get('/*', (req, res) => {
    return res.sendFile("./routing/client/index.html", {
        root: '.'
    });
});

io.on("connection", socket => {
    const client = new Client(socket);

    socket.on("loadChunk", (x, y) => {
        socket.emit("chunkLoaded", x, y, chunkManager.getChunkData(client.world, x, y));
    });
});

httpServer.listen(config.port, () => {
    console.log(`Server is running at *:${config.port}`);
});