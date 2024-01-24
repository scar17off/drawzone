import { camera } from "./camera.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export const chunks = {};
export const CHUNK_SIZE = 16;

export function renderText(text, x, y) {
    ctx.font = camera.zoom / 2 + "px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, x, y);
};

export function renderChunk(chunkData, offsetX, offsetY) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const pixel = chunkData[y][x];
            const pixelX = offsetX * CHUNK_SIZE + x * camera.zoom;
            const pixelY = offsetY * CHUNK_SIZE + y * camera.zoom;

            ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            ctx.fillRect(pixelX + camera.x, pixelY + camera.y, camera.zoom, camera.zoom);
        };
    };
};

export function renderAllChunks() {
    for (const key in chunks) {
        if (chunks.hasOwnProperty(key)) {
            const [x, y] = key.split(',').map(Number);
            const chunkData = chunks[key];
            renderChunk(chunkData, x, y);
        };
    };
};

function onRender() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderAllChunks();

    requestAnimationFrame(onRender);
};
onRender();

chunks["0,0"] = Array.from({ length: 16 }, () => Array(16).fill([0, 100, 0]));

export default {
    chunks,
    CHUNK_SIZE,
    renderText,
    renderChunk,
    renderAllChunks
};