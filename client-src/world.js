import local_player from "./local_player.js";
import socket from "./network/network.js";
import { requestRender } from "./render/renderer.js";
import { options, chunks, lines } from "./sharedState.js";
import ranks from "./shared/ranks.json";
import events from "./events.js";

const getRankByID = (rankId) => Object.values(ranks).find(rank => rank.id === parseInt(rankId));

function canDraw(x, y, color) {
    const chunkX = Math.floor(x / options.chunkSize);
    const chunkY = Math.floor(y / options.chunkSize);
    const chunkKey = `${chunkX},${chunkY}`;
    let pixelX = Math.floor(x % options.chunkSize);
    let pixelY = Math.floor(y % options.chunkSize);
    if(pixelX < 0) pixelX += options.chunkSize;
    if(pixelY < 0) pixelY += options.chunkSize;
    const existingColor = chunks[chunkKey] && chunks[chunkKey].data[pixelX] ? chunks[chunkKey].data[pixelX][pixelY] : null;
    const colorMatches = existingColor && existingColor.every((val, index) => val === color[index]);

    if(colorMatches) return false;
    
    const hasPermission = getRankByID(local_player.rank).permissions.includes("protect");
    local_player.pixelQuota.update();
    const hasQuota = local_player.pixelQuota.canSpend(1) || (local_player.pixelQuota.rate === 1 && local_player.pixelQuota.time === 0);

    return (!chunks[chunkKey] || !chunks[chunkKey].protected || hasPermission) && hasQuota;
}

const world = {
    canDraw,
    move: (x, y) => {
        socket.emit("move", x, y);
    },
    setPixel: (x, y, color) => {
        const chunkX = Math.floor(x / options.chunkSize);
        const chunkY = Math.floor(y / options.chunkSize);
        let pixelX = Math.floor(x % options.chunkSize);
        let pixelY = Math.floor(y % options.chunkSize);

        if(pixelX < 0) pixelX += options.chunkSize;
        if(pixelY < 0) pixelY += options.chunkSize;

        if(!canDraw(x, y, color)) return false;

        x = Math.floor(x), y = Math.floor(y);
        socket.emit("setPixel", x, y, color);
        const chunkKey = `${chunkX},${chunkY}`;
        if(chunks[chunkKey]) chunks[chunkKey].data[pixelX][pixelY] = color;
        requestRender();
    },
    drawLine: (from, to) => {
        const chunkXFrom = Math.floor(from[0] / options.chunkSize);
        const chunkYFrom = Math.floor(from[1] / options.chunkSize);
        const chunkXTo = Math.floor(to[0] / options.chunkSize);
        const chunkYTo = Math.floor(to[1] / options.chunkSize);
        const chunkKeyFrom = `${chunkXFrom},${chunkYFrom}`;
        const chunkKeyTo = `${chunkXTo},${chunkYTo}`;

        const hasLineQuota = local_player.lineQuota.allowance > 0 || (local_player.lineQuota.rate === 1 && local_player.lineQuota.time === 0);

        if((chunks[chunkKeyFrom] && chunks[chunkKeyFrom].protected) || 
            (chunks[chunkKeyTo] && chunks[chunkKeyTo].protected) || 
            !hasLineQuota) return false;

        socket.emit("setLine", from, to);
        lines.push([from, to]);
        requestRender();
    },
    getPixel: async (x, y) => {
        const chunkX = Math.floor(x / options.chunkSize);
        const chunkY = Math.floor(y / options.chunkSize);
        let pixelX = Math.floor(x % options.chunkSize);
        let pixelY = Math.floor(y % options.chunkSize);
    
        if(pixelX < 0) pixelX += options.chunkSize;
        if(pixelY < 0) pixelY += options.chunkSize;

        const chunkKey = `${chunkX},${chunkY}`;
        if(!chunks[chunkKey]) {
            await new Promise((resolve) => {
                socket.emit("loadChunk", [[chunkX, chunkY]]);

                socket.once("chunkLoaded", (chunkDatas) => {
                    for (let key in chunkDatas) {
                        if(key === chunkKey) {
                            chunks[key] = chunkDatas[key].data;

                            resolve();
                        }
                    }
                });
            });
        }

        return chunks[chunkKey].data[pixelX][pixelY];
    },
    setProtection: (value, chunkX, chunkY) => {
        socket.emit("protect", value, chunkX, chunkY);
        chunks[`${chunkX},${chunkY}`].protected = value;
        requestRender();
    },
    setChunk: (color, chunkX, chunkY) => {
        socket.emit("setChunk", color, chunkX, chunkY);

        const chunkKey = `${chunkX},${chunkY}`;

        if(chunks.hasOwnProperty(chunkKey)) {
            const chunkData = Array.from({ length: options.chunkSize }, () => Array.from({ length: options.chunkSize }, () => color));
            chunks[chunkKey].data = chunkData;
            requestRender();
        }
    },
    setChunkData: (chunkX, chunkY, chunkData) => {
        socket.emit("setChunkData", chunkX, chunkY, chunkData);

        const chunkKey = `${chunkX},${chunkY}`;

        if(chunks.hasOwnProperty(chunkKey)) {
            chunks[chunkKey].data = chunkData;
            requestRender();
        }
    },
    name: location.pathname.substring(1) || "main"
}

events.on("newWorld", worldName => {
    chunks = {};
    texts = {};
    lines = [];
    world.name = worldName;
    events.emit("loadChunks");
});

export default world;