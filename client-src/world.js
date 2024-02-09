import local_player from "./local_player.js";
import socket from "./network/network.js";
import { CHUNK_SIZE } from "./renderer.js";
import { chunks } from "./sharedState.js";

export default {
    move: (x, y) => {
        socket.emit("move", x, y);
    },
    setPixel: (x, y, color) => {
        if (!local_player.pixelQuota.canSpend(1)) return;

        const chunkX = Math.floor(x / 16);
        const chunkY = Math.floor(y / 16);
        let pixelX = Math.floor(x % 16);
        let pixelY = Math.floor(y % 16);

        if (pixelX < 0) pixelX += 16;
        if (pixelY < 0) pixelY += 16;

        socket.emit("setPixel", x, y, color);

        if (chunks[`${chunkX},${chunkY}`]) chunks[`${chunkX},${chunkY}`][pixelX][pixelY] = color;
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
                            chunks[key] = chunkDatas[key];
                            resolve();
                        }
                    }
                });
            });
        }

        return chunks[chunkKey][pixelX][pixelY];
    },
    setProtection: (value, chunkX, chunkY) => {
        socket.emit("protect", value, chunkX, chunkY);
    },
    setChunk: (color, chunkX, chunkY) => {
        socket.emit("setChunk", color, chunkX, chunkY);

        const chunkKey = `${chunkX},${chunkY}`;
        if (chunks.hasOwnProperty(chunkKey)) {
            const chunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => color));
            chunks[chunkKey] = chunkData;
        }
    },
    setChunkData: (chunkX, chunkY, chunkData) => {
        socket.emit("setChunkData", chunkX, chunkY, chunkData);

        const chunkKey = `${chunkX},${chunkY}`;
        if (chunks.hasOwnProperty(chunkKey)) {
            chunks[chunkKey] = chunkData;
        }
    }
}