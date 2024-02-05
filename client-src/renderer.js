import { camera, isVisible } from "./camera.js";
import { chunks, lines, texts } from "./sharedState.js";
import { mouse } from "./mouse.js";
import { players } from "./sharedState.js";
import local_player from "./local_player.js";
import events from "./events.js";
import Fx from "./fx.js";

const unloadedChunkImage = new Image();
unloadedChunkImage.src = './img/unloaded.png';

const canvas = document.getElementById("gameCanvas");
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

export function renderLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1 * camera.zoom - camera.x, y1 * camera.zoom - camera.y);
    ctx.lineTo(x2 * camera.zoom - camera.x, y2 * camera.zoom - camera.y);
    ctx.stroke();
}

export function renderChunkOutline(chunkX, chunkY) {
    const startX = chunkX * CHUNK_SIZE * camera.zoom - camera.x;
    const startY = chunkY * CHUNK_SIZE * camera.zoom - camera.y;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, CHUNK_SIZE * camera.zoom, CHUNK_SIZE * camera.zoom);
}

export function renderText(text, x, y) {
    const startX = x * camera.zoom - camera.x;
    const startY = y * camera.zoom - camera.y;

    ctx.font = camera.zoom + "px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, startX, startY);
}

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

            /*
            if (mouse.x > pixelX && mouse.x < pixelX + camera.zoom && mouse.y > pixelY && mouse.y < pixelY + camera.zoom) {
                ctx.strokeStyle = `rgb(${local_player.selectedColor.join(", ")}, 1.0)`;
                ctx.lineWidth = 2;
                ctx.strokeRect(pixelX, pixelY, camera.zoom, camera.zoom);
            }
            */
        }
    }
}

export function renderAllChunks() {
    const chunkSizeInPixels = CHUNK_SIZE * camera.zoom;
    const leftChunkIndex = Math.floor(camera.x / chunkSizeInPixels);
    const rightChunkIndex = Math.ceil((camera.x + canvas.width) / chunkSizeInPixels);
    const topChunkIndex = Math.floor(camera.y / chunkSizeInPixels);
    const bottomChunkIndex = Math.ceil((camera.y + canvas.height) / chunkSizeInPixels);

    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {
        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {
            const chunkKey = `${x},${y}`;
            if (chunks.hasOwnProperty(chunkKey)) {
                const chunkData = chunks[chunkKey];
                renderChunk(chunkData, x, y);
            } else {
                // Disable image smoothing to prevent blur
                ctx.imageSmoothingEnabled = false;

                // Render unloaded chunk image
                const startX = x * CHUNK_SIZE * camera.zoom - camera.x;
                const startY = y * CHUNK_SIZE * camera.zoom - camera.y;

                if (isVisible(startX, startY, CHUNK_SIZE * camera.zoom, CHUNK_SIZE * camera.zoom)) {
                    ctx.drawImage(unloadedChunkImage, startX, startY, CHUNK_SIZE * camera.zoom, CHUNK_SIZE * camera.zoom);
                }

                // Re-enable image smoothing for other rendering operations if necessary
                ctx.imageSmoothingEnabled = true;
            }
        }
    }
}

// Add this function to the renderer.js file
function renderPlayers() {
    Object.entries(players).forEach(([id, player]) => {
        // TODO: make it draw tool instead of circle;
        // make it draw a container with player id
        const playerX = player.x * camera.zoom - camera.x;
        const playerY = player.y * camera.zoom - camera.y;

        ctx.fillStyle = `rgb(${player.color.join(',')})`;
        ctx.beginPath();
        ctx.arc(playerX, playerY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        const textWidth = ctx.measureText(id).width;
        ctx.fillText(id, playerX + (20 - textWidth) / 2, playerY + 20);
    });
}

function renderAllLines() {
    for (let i = 0; i < lines.length; i++) {
        const [start, end] = lines[i];
        renderLine(start[0], start[1], end[0], end[1]);
    }
}

export function renderAllTexts() {
    for (const key in texts) {
        if (texts.hasOwnProperty(key)) {
            const [text, pos] = [texts[key], key];
            const [x, y] = pos.split(',').map(Number);
            renderText(text, x, y);
        }
    }
}

// line drawing
let intervalId;
canvas.addEventListener('mousedown', event => {
    mouse.prevLineX = mouse.tileX;
    mouse.prevLineY = mouse.tileY;

    if (event.buttons === 1 && event.ctrlKey) {
        if (mouse.lineX === null && mouse.lineY === null) {
            mouse.lineX = mouse.tileX;
            mouse.lineY = mouse.tileY;
            mouse.prevLineX = mouse.tileX;
            mouse.prevLineY = mouse.tileY;
        }

        intervalId = setInterval(() => {
            const prevPos = [mouse.prevLineX, mouse.prevLineY];
            const currPos = [mouse.tileX, mouse.tileY];
            mouse.prevLineX = currPos[0];
            mouse.prevLineY = currPos[1];
            mouse.lineX = currPos[0];
            mouse.lineY = currPos[1];

            events.emit("addLine", prevPos, currPos);

            lines.push([prevPos, currPos]);
        }, 1000 / 10);
    }
})

canvas.addEventListener('mouseup', () => {
    clearInterval(intervalId);
    mouse.prevLineX = mouse.lineX;
    mouse.prevLineY = mouse.lineY;
})

events.on("addText", (text, x, y) => {
    texts[`${x},${y}`] = text;
})

function onRender() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderAllChunks();
    drawGrid();
    renderAllLines();
    renderAllTexts();

    switch(local_player.currentFxRenderer.type) {
        case Fx.RECT_SELECT_ALIGNED:
            const color = local_player.selectedColor;
            const size = local_player.currentFxRenderer.params[0];

            const startX = Math.floor(mouse.tileX / size) * size;
            const startY = Math.floor(mouse.tileY / size) * size;

            ctx.strokeStyle = `rgb(${color.join(", ")}, 1.0)`;
            ctx.lineWidth = 2;
            ctx.strokeRect(startX * camera.zoom - camera.x, startY * camera.zoom - camera.y, size * camera.zoom, size * camera.zoom);
            break;
        default:
            break;
    }

    renderPlayers();

    requestAnimationFrame(onRender);
}
onRender();

export default {
    chunks,
    CHUNK_SIZE,
    renderText,
    renderChunk,
    renderAllChunks
}