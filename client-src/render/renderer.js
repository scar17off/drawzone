import { camera } from "../camera.js";
import { options, chunks, lines, texts } from "../sharedState.js";
import { mouse } from "../mouse.js";
import { players } from "../sharedState.js";
import local_player from "../local_player.js";
import { toolIDs } from "../tools.js";
import { cursors } from "../cursors.js";
import ChunkCluster from "./ChunkCluster.js";
import Fx from "../fx.js";

const unloadedChunkImage = new Image();
unloadedChunkImage.src = "./img/unloaded.png";

// Canvas autosize
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export function drawGrid() {
    const gridColor = "rgba(0, 0, 0, 0.2)";
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // chunk grid
    for (let x = 0; x < canvas.width; x += camera.zoom * options.chunkSize) {
        ctx.beginPath();
        ctx.moveTo(x - camera.x % (camera.zoom * options.chunkSize), 0);
        ctx.lineTo(x - camera.x % (camera.zoom * options.chunkSize), canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += camera.zoom * options.chunkSize) {
        ctx.beginPath();
        ctx.moveTo(0, y - camera.y % (camera.zoom * options.chunkSize));
        ctx.lineTo(canvas.width, y - camera.y % (camera.zoom * options.chunkSize));
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
    ctx.strokeStyle = "#000000";
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

    const startX = chunkX * options.chunkSize * camera.zoom - camera.x;
    const startY = chunkY * options.chunkSize * camera.zoom - camera.y;
    const endX = startX + options.chunkSize * camera.zoom;
    const endY = startY + options.chunkSize * camera.zoom;

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

export function renderAllChunks() {
    const chunkSizeInPixels = options.chunkSize * camera.zoom;
    const leftChunkIndex = Math.floor(camera.x / chunkSizeInPixels);
    const rightChunkIndex = Math.ceil((camera.x + canvas.width) / chunkSizeInPixels);
    const topChunkIndex = Math.floor(camera.y / chunkSizeInPixels);
    const bottomChunkIndex = Math.ceil((camera.y + canvas.height) / chunkSizeInPixels);
    
    ctx.imageSmoothingEnabled = false;

    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {
        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {
            const chunkKey = `${x},${y}`;
            
            if(chunks.hasOwnProperty(chunkKey)) {
                const chunkCluster = chunks[chunkKey];
                const startX = x * options.chunkSize * camera.zoom - camera.x;
                const startY = y * options.chunkSize * camera.zoom - camera.y;

                ctx.drawImage(chunkCluster.getCanvas(), startX, startY, options.chunkSize * camera.zoom, options.chunkSize * camera.zoom);

                if(chunkCluster.protected) renderChunkOutline(x, y);
            } else {
                const startX = x * options.chunkSize * camera.zoom - camera.x;
                const startY = y * options.chunkSize * camera.zoom - camera.y;
                ctx.drawImage(unloadedChunkImage, startX, startY, options.chunkSize * camera.zoom, options.chunkSize * camera.zoom);
            }
        }
    }
}

function renderPlayers() {
    Object.entries(players).forEach(([id, player]) => {
        if(player.id === local_player.id || id === local_player.id) return;

        const playerX = player.x * camera.zoom - camera.x;
        const playerY = player.y * camera.zoom - camera.y;

        const toolName = Object.keys(toolIDs).find(key => toolIDs[key] === player.tool);
        
        ctx.font = "12px Arial";
        const textWidth = ctx.measureText(id).width;
        const padding = 4; // padding around text
        const idContainerWidth = textWidth + padding * 2;
        const idContainerHeight = parseInt(ctx.font, 10) + padding * 2; // height based on font size

        ctx.strokeStyle = `rgb(${player.color.join(", ")})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]); // dotted line pattern
        const idContainerY = playerY + (72 / (camera.zoom / 8)) + 5; // below player tool
        ctx.strokeRect(playerX, idContainerY, idContainerWidth, idContainerHeight);

        ctx.fillStyle = "black";
        // centered within the container
        const textX = playerX + padding;
        const textY = idContainerY + padding + (idContainerHeight / 2);
        ctx.fillText(id, textX, textY);
        ctx.setLineDash([]);

        const toolData = cursors[toolName];
        if(toolData && toolData.base64) {
            const img = new Image(72, 72);
            img.src = toolData.base64;

            let toolSize;
            if(camera.zoom < 16) {
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
        if(texts.hasOwnProperty(key)) {
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
    if(!options.needsUpdate) return;
    options.needsUpdate = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(options.pixels) renderAllChunks();
    if(options.grid) drawGrid();
    if(options.lines) renderAllLines();
    if(options.text) renderAllTexts();

    if(options.fx && typeof local_player.currentFxRenderer === "function") local_player.currentFxRenderer(mouse.tileX, mouse.tileY, ctx);

    renderPlayers();
}

export default {
    renderText,
    renderAllChunks,
    requestRender
}