module.exports = httpServer => {
    const Client = require("./player/Client.js");
    const chunkManager = require("./world/chunkManager.js");
    const textManager = require("./world/textManager.js");
    const lineManager = require("./world/lineManager.js");
    const { getRankByID } = require("./player/rankingUtils.js");
    const { formatMessage } = require("./utils.js");
    const { Command } = require("./player/commands.js");

    const socketIO = require("socket.io");

    const io = socketIO(httpServer);
    server.io = io;

    io.on("connection", socket => {
        const client = new Client(socket);
        socket.join(client.world || "main");

        socket.broadcast.to(client.world).emit("playerJoin", client.id);

        socket.on("setPixel", (x, y, color) => {
            x = Math.floor(x);
            y = Math.floor(y);
            
            client.color = color;

            const chunkX = Math.floor(x / 16);
            const chunkY = Math.floor(y / 16);

            client.pixelQuota.update();
            const hasQuota = client.pixelQuota.canSpend(1) || (client.pixelQuota.rate === 1 && client.pixelQuota.time === 0);
            if(!hasQuota) return;
            if(!getRankByID(client.rank).permissions.includes("protect") && chunkManager.get_protection(client.world, chunkX, chunkY) === true) return;
            if(server.config.saving.savePixels) chunkManager.set_pixel(client.world, x, y, color);
            
            server.io.to(client.world).emit("newPixel", x, y, color);
        });

        socket.on("setLine", (from, to) => {
            if(!client.lineQuota.canSpend(1)) return;
            if(server.config.saving.saveLines) lineManager.draw_line(client.world, from, to);
            
            server.io.to(client.world).emit("newLine", from, to);
        });

        socket.on("setText", (text, x, y) => {
            if(server.config.saving.saveTexts) textManager.set_text(client.world, text, x, y);

            server.io.to(client.world).emit("newText", text, x, y);
        });

        socket.on("setChunk", (color, chunkX, chunkY) => {
            if(!getRankByID(client.rank).permissions.includes("erase")) return;

            const chunkData = chunkManager.set_rgb(client.world, chunkX, chunkY, color);
            const isProtected = chunkManager.get_protection(client.world, chunkX, chunkY);

            const updates = {};
            updates[`${chunkX},${chunkY}`] = { data: chunkData, protected: isProtected };

            server.io.to(client.world).emit("chunkLoaded", updates);
        });

        socket.on("setChunkData", (chunkX, chunkY, chunkData) => {
            if(!getRankByID(client.rank).permissions.includes("erase")) return;

            chunkManager.set_chunkdata(client.world, chunkX, chunkY, chunkData);
            const isProtected = chunkManager.get_protection(client.world, chunkX, chunkY);

            const updates = {};
            updates[`${chunkX},${chunkY}`] = { data: chunkData, protected: isProtected };

            server.io.to(client.world).emit("chunkLoaded", updates);
        });

        socket.on("protect", (value, chunkX, chunkY) => {
            if(!getRankByID(client.rank).permissions.includes("protect")) return;
            chunkManager.set_protection(client.world, chunkX, chunkY, value);
            server.io.to(client.world).emit("protectionUpdated", chunkX, chunkY, value);
        });

        socket.on("move", (x, y) => {
            client.x = x;
            client.y = y;

            socket.broadcast.to(client.world).emit("playerMoved", client.id, x, y);
        });

        socket.on("setTool", toolID => {
            client.tool = toolID;

            socket.broadcast.to(client.world).emit("playerUpdate", client.id, client.tool, client.color);
        });

        socket.on("loadChunk", (loadQueueOrX, maybeY) => {
            const chunkDatas = {};
            
            if (typeof loadQueueOrX === 'object') {
                for(let i in loadQueueOrX) {
                    const [x, y] = loadQueueOrX[i];

                    chunkDatas[`${x},${y}`] = {
                        data: chunkManager.get_chunkdata(client.world, x, y),
                        protected: chunkManager.get_protection(client.world, x, y)
                    }
                }
            } else if (typeof loadQueueOrX === 'number' && typeof maybeY === 'number') {
                const x = loadQueueOrX, y = maybeY;
                chunkDatas[`${x},${y}`] = {
                    data: chunkManager.get_chunkdata(client.world, x, y),
                    protected: chunkManager.get_protection(client.world, x, y)
                }
            }

            socket.emit("chunkLoaded", chunkDatas);
        });

        socket.on("send", message => {
            const rank = getRankByID(client.rank);
            if(!rank.permissions.includes("chat")) return;
            if(message.length > server.config.maxMessageLength && !rank.permissions.includes("bypassChatLength")) return;
            
            message = message.trim();
            if(message.startsWith('/')) {
                new Command(client, message);
                return;
            }

            const formattedMessage = formatMessage(client, rank, message);
            server.io.to(client.world).emit("message", formattedMessage);
            server.events.emit("message", message, client, rank);
        });

        socket.on("disconnect", () => {
            server.io.to(client.world).emit("playerLeft", client.id);
        });
    });
}