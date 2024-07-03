module.exports = httpServer => {
    const Client = require("./player/Client.js");
    const chunkManager = require("./world/chunkManager.js");
    const textManager = require("./world/textManager.js");
    const lineManager = require("./world/lineManager.js");
    const { getWorldByName } = require("./world/worldManager.js");
    const { formatMessage } = require("./utils.js");
    const { Command } = require("./player/commands.js");

    const socketIO = require("socket.io");

    const io = socketIO(httpServer);
    server.io = io;

    function broadcastMessage(world, message) {
        getWorldByName(world).addUpdate(message);
    }

    io.on("connection", socket => {
        const client = new Client(socket);
        socket.join(client.world);

        broadcastMessage(client.world, { type: "playerJoin", id: client.id });
        server.events.emit("playerJoin", client);

        socket.on("setPixel", (x, y, color) => {
            if(getWorldByName(client.world).readonly && !client.hasPermission("bypassReadOnly")) return;
            if(!client.hasPermission("setPixel")) return;

            x = Math.floor(x);
            y = Math.floor(y);
            
            client.color = color;

            const chunkX = Math.floor(x / 16);
            const chunkY = Math.floor(y / 16);

            client.pixelQuota.update();
            const hasQuota = client.pixelQuota.canSpend(1) || (client.pixelQuota.rate === 1 && client.pixelQuota.time === 0);
            if(!hasQuota) return;
            if(!client.hasPermission("bypassProtection") && chunkManager.get_protection(client.world, chunkX, chunkY) === true) return;
            if(server.config.saving.savePixels) chunkManager.set_pixel(client.world, x, y, color);
            
            broadcastMessage(client.world, { type: "newPixel", x, y, color });
            server.events.emit("newPixel", client, x, y, color);
        });

        socket.on("setLine", (from, to) => {
            if(getWorldByName(client.world).readonly && !client.hasPermission("bypassReadOnly")) return;

            const maxLength = 64;
            const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
            if(distance > maxLength && !client.hasPermission("bypassLineLength")) return;

            if(!client.lineQuota.canSpend(1)) return;

            // Check for intersection with protected chunks
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const steps = Math.max(Math.abs(dx), Math.abs(dy));
            const xIncrement = dx / steps;
            const yIncrement = dy / steps;
            let x = from.x;
            let y = from.y;

            for(let i = 0; i <= steps; i++) {
                const chunkX = Math.floor(x / 16);
                const chunkY = Math.floor(y / 16);
                if(!client.hasPermission("bypassProtection") && chunkManager.get_protection(client.world, chunkX, chunkY) === true) return;
                x += xIncrement;
                y += yIncrement;
            }

            if(server.config.saving.saveLines) lineManager.draw_line(client.world, from, to);
            
            broadcastMessage(client.world, { type: "newLine", from, to });
        });

        socket.on("setText", (text, x, y) => {
            if(getWorldByName(client.world).readonly && !client.hasPermission("bypassReadOnly")) return;
            if(!client.hasPermission("bypassTextLength") && text.length > 128) return;
            if(server.config.saving.saveTexts) textManager.set_text(client.world, text, x, y);

            broadcastMessage(client.world, { type: "newText", text, x, y });
        });

        socket.on("setChunk", (color, chunkX, chunkY) => {
            if(getWorldByName(client.world).readonly && !client.hasPermission("bypassReadOnly")) return;
            if(!client.hasPermission("erase")) return;

            const chunkData = chunkManager.set_rgb(client.world, chunkX, chunkY, color);
            const isProtected = chunkManager.get_protection(client.world, chunkX, chunkY);

            const updates = {};
            updates[`${chunkX},${chunkY}`] = { data: chunkData, protected: isProtected };

            broadcastMessage(client.world, { type: "chunkLoaded", updates });
        });

        socket.on("setChunkData", (chunkX, chunkY, chunkData) => {
            if(getWorldByName(client.world).readonly && !client.hasPermission("bypassReadOnly")) return;
            if(!client.hasPermission("erase")) return;

            chunkManager.set_chunkdata(client.world, chunkX, chunkY, chunkData);
            const isProtected = chunkManager.get_protection(client.world, chunkX, chunkY);

            const updates = {};
            updates[`${chunkX},${chunkY}`] = { data: chunkData, protected: isProtected };

            broadcastMessage(client.world, { type: "chunkLoaded", updates });
        });

        socket.on("protect", (value, chunkX, chunkY) => {
            if(!client.hasPermission("protect")) return;
            chunkManager.set_protection(client.world, chunkX, chunkY, value);

            broadcastMessage(client.world, { type: "protectionUpdated", chunkX, chunkY, value });
        });

        socket.on("move", (x, y) => {
            client.x = x;
            client.y = y;

            broadcastMessage(client.world, { type: "playerMoved", id: client.id, x, y });
            server.events.emit("playerUpdate", client);
        });

        socket.on("setTool", toolID => {
            client.tool = toolID;

            broadcastMessage(client.world, { type: "playerUpdate", id: client.id, tool: client.tool, color: client.color });
        });

        socket.on("loadChunk", (loadQueueOrX, maybeY) => {
            const chunkDatas = {};
            
            if(typeof loadQueueOrX === "object") {
                for(let i in loadQueueOrX) {
                    const [x, y] = loadQueueOrX[i];

                    chunkDatas[`${x},${y}`] = {
                        data: chunkManager.get_chunkdata(client.world, x, y),
                        protected: chunkManager.get_protection(client.world, x, y)
                    }
                }
            } else if(typeof loadQueueOrX === "number" && typeof maybeY === "number") {
                const x = loadQueueOrX, y = maybeY;
                chunkDatas[`${x},${y}`] = {
                    data: chunkManager.get_chunkdata(client.world, x, y),
                    protected: chunkManager.get_protection(client.world, x, y)
                }
            }

            socket.emit("chunkLoaded", chunkDatas);
        });

        socket.on("send", message => {
            if(!client.hasPermission("chat")) return;
            if(message.length > server.config.maxMessageLength && !client.hasPermission("bypassChatLength")) return;
            
            message = message.trim();
            if(message.startsWith('/')) {
                new Command(client, message);
                return;
            }

            const formattedMessage = formatMessage(client, rank, message);
            socket.emit("message", formattedMessage);
            broadcastMessage(client.world, { type: "message", message: formattedMessage });
            server.events.emit("message", message, client, rank);
        });

        socket.on("disconnect", () => {
            broadcastMessage(client.world, { type: "playerLeft", id: client.id });
            server.events.emit("playerLeft", client);
        });
    });
}