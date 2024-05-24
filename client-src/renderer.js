import { camera } from "./camera.js";
import { chunks, lines, texts } from "./sharedState.js";
import { mouse } from "./mouse.js";
import { players } from "./sharedState.js";
import local_player from "./local_player.js";
import Fx from "./fx.js";
import { toolIDs } from "./tools.js";
import { cursors } from "./cursors.js";

export const options = {
    grid: true,
    text: true,
    lines: true,
    pixels: true,
    needsUpdate: false
}

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
    const isCurrentChunkProtected = chunks[`${chunkX},${chunkY}`].protected;
    const isLeftChunkProtected = chunks.hasOwnProperty(`${chunkX-1},${chunkY}`) ? chunks[`${chunkX-1},${chunkY}`].protected : false;
    const isRightChunkProtected = chunks.hasOwnProperty(`${chunkX+1},${chunkY}`) ? chunks[`${chunkX+1},${chunkY}`].protected : false;
    const isTopChunkProtected = chunks.hasOwnProperty(`${chunkX},${chunkY-1}`) ? chunks[`${chunkX},${chunkY-1}`].protected : false;
    const isBottomChunkProtected = chunks.hasOwnProperty(`${chunkX},${chunkY+1}`) ? chunks[`${chunkX},${chunkY+1}`].protected : false;

    const startX = chunkX * CHUNK_SIZE * camera.zoom - camera.x;
    const startY = chunkY * CHUNK_SIZE * camera.zoom - camera.y;
    const endX = startX + CHUNK_SIZE * camera.zoom;
    const endY = startY + CHUNK_SIZE * camera.zoom;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    if(isCurrentChunkProtected) {
        if(!isLeftChunkProtected) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX, endY);
            ctx.stroke();
        }
        if(!isRightChunkProtected) {
            ctx.beginPath();
            ctx.moveTo(endX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        if(!isTopChunkProtected) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, startY);
            ctx.stroke();
        }
        if(!isBottomChunkProtected) {
            ctx.beginPath();
            ctx.moveTo(startX, endY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
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
            const pixel = chunkData.data[x][y];
            const pixelX = startX + x * camera.zoom;
            const pixelY = startY + y * camera.zoom;

            ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            ctx.fillRect(pixelX, pixelY, camera.zoom, camera.zoom);

            if(chunkData.protected) {
                renderChunkOutline(chunkX, chunkY);
            }

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
                // prevent blur
                ctx.imageSmoothingEnabled = false;

                const startX = x * CHUNK_SIZE * camera.zoom - camera.x;
                const startY = y * CHUNK_SIZE * camera.zoom - camera.y;
                ctx.drawImage(unloadedChunkImage, startX, startY, CHUNK_SIZE * camera.zoom, CHUNK_SIZE * camera.zoom);

                ctx.imageSmoothingEnabled = true;
            }
        }
    }
}

function renderPlayers() {
    Object.entries(players).forEach(([id, player]) => {
        const playerX = player.x * camera.zoom - camera.x;
        const playerY = player.y * camera.zoom - camera.y;

        const toolName = Object.keys(toolIDs).find(key => toolIDs[key] === player.tool);
        
        ctx.font = '12px Arial';
        const textWidth = ctx.measureText(id).width;
        const padding = 4; // padding around text
        const idContainerWidth = textWidth + padding * 2;
        const idContainerHeight = parseInt(ctx.font, 10) + padding * 2; // height based on font size

        ctx.strokeStyle = `rgb(${player.color.join(", ")})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]); // dotted line pattern
        const idContainerY = playerY + (72 / (camera.zoom / 8)) + 5; // below player tool
        ctx.strokeRect(playerX, idContainerY, idContainerWidth, idContainerHeight);

        ctx.fillStyle = 'black';
        // centered within the container
        const textX = playerX + padding;
        const textY = idContainerY + padding + (idContainerHeight / 2);
        ctx.fillText(id, textX, textY);
        ctx.setLineDash([]);

        const toolData = cursors[toolName];
        if (toolData && toolData.base64) {
            const img = new Image(72, 72);
            img.src = toolData.base64;

            let toolSize;
            if (camera.zoom < 16) {
                toolSize = Math.min(72, 72 / (camera.zoom / 8)) / 2;
            } else {
                toolSize = Math.min(72, 72 / (camera.zoom / 8));
            }
            
            ctx.drawImage(img, playerX, playerY, toolSize, toolSize);
        } else {
            console.error(`No base64 data found for tool ${toolName}`);
        }
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

export function requestRender() {
    options.needsUpdate = true;
    onRender();
}

function onRender() {
    if (!options.needsUpdate) return;
    options.needsUpdate = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(options.pixels) renderAllChunks();
    if(options.grid) drawGrid();
    if(options.lines) renderAllLines();
    if(options.text) renderAllTexts();

    // player fx
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
        case Fx.AREA_SELECT:
            if (local_player.currentFxRenderer.params.length !== 3) return;
            const [start, end, step] = local_player.currentFxRenderer.params;
            const adjustedStartX = step === CHUNK_SIZE ? Math.floor(start[0] / step) * step : start[0];
            const adjustedStartY = step === CHUNK_SIZE ? Math.floor(start[1] / step) * step : start[1];
            const adjustedEndX = step === CHUNK_SIZE ? Math.floor(end[0] / step) * step : end[0];
            const adjustedEndY = step === CHUNK_SIZE ? Math.floor(end[1] / step) * step : end[1];

            ctx.strokeStyle = `rgba(${local_player.selectedColor.join(", ")}, 0.5)`;
            ctx.lineWidth = 2;

            for (let x = adjustedStartX; x <= adjustedEndX; x += step) {
                for (let y = adjustedStartY; y <= adjustedEndY; y += step) {
                    if ((x === adjustedStartX || x === adjustedEndX || y === adjustedStartY || y === adjustedEndY)) {
                        ctx.strokeRect(Math.floor(x * camera.zoom - camera.x), Math.floor(y * camera.zoom - camera.y), step * camera.zoom, step * camera.zoom);
                    }
                }
            }
        case Fx.LINE:
            if (local_player.currentFxRenderer.params.length !== 2) return;
            const [startPoint, endPoint] = local_player.currentFxRenderer.params;

            ctx.strokeStyle = `rgb(0, 0, 0, 1.0)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(startPoint[0] * camera.zoom - camera.x, startPoint[1] * camera.zoom - camera.y);
            ctx.lineTo(endPoint[0] * camera.zoom - camera.x, endPoint[1] * camera.zoom - camera.y);
            ctx.stroke();
            break;
        default:
            break;
    }

    renderPlayers();
}

export default {
    renderText,
    renderChunk,
    renderAllChunks,
    options,
    requestRender
}