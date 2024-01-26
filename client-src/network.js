import { camera, canvas } from "./camera.js";
import { CHUNK_SIZE } from "./renderer.js";
import { chunks } from "./sharedState.js";

const socket = io();

socket.on("connect", () => {
    console.log("Connected!");

    socket.on("message", message => {
        console.log(message);
    });
    
    socket.on("chunkLoaded", (x, y, chunkData) => {
        addChunk(chunkData, x, y);
    });
});

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
                socket.emit("loadChunk", x, y);
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

    // Create a set of visible chunk keys
    const visibleChunks = new Set();
    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {
        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {
            visibleChunks.add(`${x},${y}`);
        }
    }

    // Iterate over the keys in the chunks object
    Object.keys(chunks).forEach(chunkKey => {
        if (!visibleChunks.has(chunkKey)) {
            // If the chunk is not in the set of visible chunks, delete it
            delete chunks[chunkKey];
        }
    });
}

export default socket;