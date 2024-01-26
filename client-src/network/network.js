import { camera, canvas } from "../camera.js";
import { CHUNK_SIZE } from "../renderer.js";
import { chunks, lines, texts } from "../sharedState.js";
import { mouse } from "../mouse.js";
import local_player from "../local_player.js";
import events from "../events.js";

var loadQueue = [];

const socket = io();

socket.on("connect", () => {
    console.log("Connected!");

    socket.on("message", message => {
        console.log(message);
    })
    
    socket.on("chunkLoaded", (chunkDatas) => {
        for(let key in chunkDatas) {
            const [x, y] = key.split(',').map(Number);
            addChunk(chunkDatas[key], x, y);
        }
    })

    socket.on("newLine", (from, to) => {
        lines.push([from, to]);
    })

    socket.on("newText", (text, x, y) => {
        texts[`${x},${y}`] = text;
    })
})

events.on("addText", (text, x, y) => {
    socket.emit("setText", text, x, y);
})

events.on("addLine", (from, to) => {
    socket.emit("setLine", from, to);
})

canvas.addEventListener('mousemove', () => {
    const pos = { x: mouse.tileX, y: mouse.tileY };

    socket.emit("move", pos.x, pos.y);
})

canvas.addEventListener('mousemove', event => {
    if(event.buttons === 1 && !event.ctrlKey) {
        if(!local_player.pixelQuota.canSpend(1)) return;

        const pos = { x: mouse.tileX, y: mouse.tileY };

        const chunkX = Math.floor(pos.x / 16);
        const chunkY = Math.floor(pos.y / 16);
        const pixelX = Math.floor(pos.x % 16);
        const pixelY = Math.floor(pos.y % 16);
        
        socket.emit("setPixel", pos.x, pos.y, local_player.selectedColor);

        if(chunks[`${chunkX},${chunkY}`]) {
            chunks[`${chunkX},${chunkY}`][pixelX][pixelY] = local_player.selectedColor; // bruh
        }
    }
})

setInterval(() => {
    if(loadQueue.length > 0) {
        socket.emit("loadChunk", loadQueue);
        loadQueue = [];
    };
}, 1000);

function addChunk(chunkData, chunkX, chunkY) {
    const key = `${chunkX},${chunkY}`;
    chunks[key] = chunkData;
}

export function loadVisibleChunks() {
    const chunkSizeInPixels = CHUNK_SIZE * camera.zoom;
    const leftChunkIndex = Math.floor(camera.x / chunkSizeInPixels);
    const rightChunkIndex = Math.ceil((camera.x + canvas.width) / chunkSizeInPixels);
    const topChunkIndex = Math.floor(camera.y / chunkSizeInPixels);
    const bottomChunkIndex = Math.ceil((camera.y + canvas.height) / chunkSizeInPixels);

    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {
        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {
            const chunkKey = `${x},${y}`;
            if (!chunks.hasOwnProperty(chunkKey)) {
                loadQueue.push([x, y]);
            }
        }
    }
}

export function unloadInvisibleChunks() {
    const chunkSizeInPixels = CHUNK_SIZE * camera.zoom;
    const leftChunkIndex = Math.floor(camera.x / chunkSizeInPixels);
    const rightChunkIndex = Math.ceil((camera.x + canvas.width) / chunkSizeInPixels);
    const topChunkIndex = Math.floor(camera.y / chunkSizeInPixels);
    const bottomChunkIndex = Math.ceil((camera.y + canvas.height) / chunkSizeInPixels);

    const visibleChunks = new Set();
    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {
        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {
            visibleChunks.add(`${x},${y}`);
        }
    }

    Object.keys(chunks).forEach(chunkKey => {
        if (!visibleChunks.has(chunkKey)) {
            delete chunks[chunkKey];
        }
    })
}

export default socket;