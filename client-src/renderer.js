import { camera } from "./camera.js";
import { chunks } from "./sharedState.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export const CHUNK_SIZE = 16;

export function drawGrid() {
    const gridColor = 'rgba(0, 0, 0, 0.2)';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // chunk grid
    for (let x = 0; x < canvas.width; x += camera.zoom * CHUNK_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x - camera.x % (camera.zoom * CHUNK_SIZE), 0);
        ctx.lineTo(x - camera.x % (camera.zoom * CHUNK_SIZE), canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += camera.zoom * CHUNK_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y - camera.y % (camera.zoom * CHUNK_SIZE));
        ctx.lineTo(canvas.width, y - camera.y % (camera.zoom * CHUNK_SIZE));
        ctx.stroke();
    }

    // pixel grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += camera.zoom) {
        ctx.beginPath();
        ctx.moveTo(x - camera.x % camera.zoom, 0);
        ctx.lineTo(x - camera.x % camera.zoom, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += camera.zoom) {
        ctx.beginPath();
        ctx.moveTo(0, y - camera.y % camera.zoom);
        ctx.lineTo(canvas.width, y - camera.y % camera.zoom);
        ctx.stroke();
    }
}

export function renderText(text, x, y) {
    ctx.font = camera.zoom / 2 + "px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, x, y);
};

export function renderChunk(chunkData, chunkX, chunkY) {
    const startX = chunkX * CHUNK_SIZE * camera.zoom - camera.x;
    const startY = chunkY * CHUNK_SIZE * camera.zoom - camera.y;

    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            const pixel = chunkData[x][y];
            const pixelX = startX + x * camera.zoom;
            const pixelY = startY + y * camera.zoom;

            ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            ctx.fillRect(pixelX, pixelY, camera.zoom, camera.zoom);
        }
    }
}

export function renderAllChunks() {
    for (const key in chunks) {
        if (chunks.hasOwnProperty(key)) {
            const [chunkX, chunkY] = key.split(',').map(Number);
            const chunkData = chunks[key];
            renderChunk(chunkData, chunkX, chunkY);
        };
    };
};

function onRender() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderAllChunks();

    drawGrid();

    requestAnimationFrame(onRender);
};
onRender();

export default {
    chunks,
    CHUNK_SIZE,
    renderText,
    renderChunk,
    renderAllChunks
};