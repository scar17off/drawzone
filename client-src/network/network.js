import { camera, canvas } from "../camera.js";
import { CHUNK_SIZE } from "../renderer.js";
import { chunks } from "../sharedState.js";
import { mouse } from "../mouse.js";
import local_player from "../local_player.js";

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
})

canvas.addEventListener('mousemove', event => {
    const pos = { x: mouse.tileX, y: mouse.tileY };

    socket.emit("move", pos.x, pos.y);

    if(event.buttons == 1) socket.emit("setPixel", pos.x, pos.y, local_player.selectedColor);
});

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