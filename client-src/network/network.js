import { camera, canvas } from "../camera.js";
import { CHUNK_SIZE } from "../renderer.js";
import { chunks, lines, texts } from "../sharedState.js";
import { mouse } from "../mouse.js";
import events from "../events.js";

var loadQueue = [];

const socket = io();

const getLoginKeys = () => Object.keys(localStorage).filter(key => key.endsWith("login"));
const loginKeys = getLoginKeys();

socket.on("connect", () => {
    console.log("Connected!");
    document.getElementById("players-display").innerText = "Players: 1"; // we connected

    loginKeys.forEach(key => {
        const value = localStorage.getItem(key);
        socket.emit("send", `/${key} ${value}`);
    });
    
    socket.on("chunkLoaded", (chunkDatas) => {
        for(let key in chunkDatas) {
            const [x, y] = key.split(',').map(Number);
            addChunk(chunkDatas[key], x, y);
        }
    });

    socket.on("newPixel", (x, y, color) => {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);

        let pixelX = Math.floor(x % 16);
        let pixelY = Math.floor(y % 16);
        
        if (pixelX < 0) pixelX += 16;
        if (pixelY < 0) pixelY += 16;

        if(chunks[`${chunkX},${chunkY}`]) {
            chunks[`${chunkX},${chunkY}`][pixelX][pixelY] = color;
        }
    })

    socket.on("newLine", (from, to) => {
        lines.push([from, to]);
    });

    socket.on("newText", (text, x, y) => {
        texts[`${x},${y}`] = text;
    });
});

events.on("addText", (text, x, y) => {
    socket.emit("setText", text, x, y);
});

events.on("addLine", (from, to) => {
    socket.emit("setLine", from, to);
});

canvas.addEventListener('mousemove', () => {
    const pos = { x: mouse.tileX, y: mouse.tileY };

    socket.emit("move", pos.x, pos.y);
});

setInterval(() => {
    if(loadQueue.length > 0) {
        socket.emit("loadChunk", loadQueue);
        loadQueue = [];
    };
}, 1000 / 2);

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
    });
}

export default socket;