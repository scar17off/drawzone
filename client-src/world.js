import local_player from "./local_player.js";
import socket from "./network/network.js";
import { CHUNK_SIZE, requestRender } from "./renderer.js";
import { chunks, lines } from "./sharedState.js";
import ranks from "./shared/ranks.json";

const getRankByID = (rankId) => Object.values(ranks).find(rank => rank.id === parseInt(rankId));

function canDraw(x, y) {
    const chunkX = Math.floor(x / 16);
    const chunkY = Math.floor(y / 16);
    const chunkKey = `${chunkX},${chunkY}`;
    const hasPermission = getRankByID(local_player.rank).permissions.includes("protect");
    local_player.pixelQuota.update();
    const hasQuota = local_player.pixelQuota.allowance > 0 || (local_player.pixelQuota.rate === 1 && local_player.pixelQuota.time === 0);

    return (!chunks[chunkKey] || !chunks[chunkKey].protected || hasPermission) && hasQuota;
}

export default {
    canDraw,
    move: (x, y) => {
        socket.emit("move", x, y);
    },
    setPixel: (x, y, color) => {
        const chunkX = Math.floor(x / 16);
        const chunkY = Math.floor(y / 16);
        let pixelX = Math.floor(x % 16);
        let pixelY = Math.floor(y % 16);

        if (pixelX < 0) pixelX += 16;
        if (pixelY < 0) pixelY += 16;

        const chunkKey = `${chunkX},${chunkY}`;
        const existingColor = chunks[chunkKey] ? chunks[chunkKey].data[pixelX][pixelY] : null;

        if (existingColor && existingColor.every((val, index) => val === color[index])
        && !canDraw(x, y)) return false;

        x = Math.floor(x), y = Math.floor(y);
        socket.emit("setPixel", x, y, color);
        if (chunks[chunkKey]) chunks[chunkKey].data[pixelX][pixelY] = color;
        requestRender();
    },
    drawLine: (from, to) => {
        const chunkXFrom = Math.floor(from[0] / 16);
        const chunkYFrom = Math.floor(from[1] / 16);
        const chunkXTo = Math.floor(to[0] / 16);
        const chunkYTo = Math.floor(to[1] / 16);
        const chunkKeyFrom = `${chunkXFrom},${chunkYFrom}`;
        const chunkKeyTo = `${chunkXTo},${chunkYTo}`;

        const hasLineQuota = local_player.lineQuota.allowance > 0 || (local_player.lineQuota.rate === 1 && local_player.lineQuota.time === 0);

        if ((chunks[chunkKeyFrom] && chunks[chunkKeyFrom].protected) || 
            (chunks[chunkKeyTo] && chunks[chunkKeyTo].protected) || 
            !hasLineQuota) return false;

        socket.emit("setLine", from, to);
        lines.push([from, to]);
        requestRender();
    },
    getPixel: async (x, y) => {
        const chunkX = Math.floor(x / 16);
        const chunkY = Math.floor(y / 16);
        let pixelX = Math.floor(x % 16);
        let pixelY = Math.floor(y % 16);
    
        if (pixelX < 0) pixelX += 16;
        if (pixelY < 0) pixelY += 16;

        const chunkKey = `${chunkX},${chunkY}`;
        if (!chunks[chunkKey]) {
            await new Promise((resolve) => {
                socket.emit("loadChunk", [[chunkX, chunkY]]);

                socket.once("chunkLoaded", (chunkDatas) => {
                    for (let key in chunkDatas) {
                        if (key === chunkKey) {
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

        if (chunks.hasOwnProperty(chunkKey)) {
            const chunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => color));
            chunks[chunkKey].data = chunkData;
            requestRender();
        }
    },
    setChunkData: (chunkX, chunkY, chunkData) => {
        socket.emit("setChunkData", chunkX, chunkY, chunkData);

        const chunkKey = `${chunkX},${chunkY}`;

        if (chunks.hasOwnProperty(chunkKey)) {
            chunks[chunkKey].data = chunkData;
            requestRender();
        }
    }
}