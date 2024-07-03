import { camera } from "./camera.js";
import local_player from "./local_player.js";
import { options } from "./sharedState.js";

export default {
    NONE: null,
    RECT_SELECT_ALIGNED: (size, color) => (x, y, ctx) => {
        color = local_player.selectedColor;
        const startX = Math.floor(x / size) * size;
        const startY = Math.floor(y / size) * size;

        ctx.strokeStyle = `rgb(${color.join(", ")})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(startX * camera.zoom - camera.x, startY * camera.zoom - camera.y, size * camera.zoom, size * camera.zoom);
    },
    AREA_SELECT: (start, end, step, color) => (x, y, ctx) => {
        color = local_player.selectedColor;
        const adjustedStartX = step === options.chunkSize ? Math.floor(start[0] / step) * step : start[0];
        const adjustedStartY = step === options.chunkSize ? Math.floor(start[1] / step) * step : start[1];
        const adjustedEndX = step === options.chunkSize ? Math.floor(end[0] / step) * step : end[0];
        const adjustedEndY = step === options.chunkSize ? Math.floor(end[1] / step) * step : end[1];

        const width = adjustedEndX - adjustedStartX + step;
        const height = adjustedEndY - adjustedStartY + step;
        const widthInChunks = width / options.chunkSize;
        const heightInChunks = height / options.chunkSize;

        ctx.strokeStyle = `rgb(${color.join(", ")})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(
            Math.floor(adjustedStartX * camera.zoom - camera.x),
            Math.floor(adjustedStartY * camera.zoom - camera.y),
            width * camera.zoom,
            height * camera.zoom
        );

        const text = `${width}x${height} pixels, ${widthInChunks}x${heightInChunks} chunks`;
        const textX = (adjustedStartX + width / 2) * camera.zoom - camera.x;
        const textY = (adjustedStartY + height / 2) * camera.zoom - camera.y;

        const fontSize = 14;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = "black";
        ctx.fillText(text, textX, textY);
    },
    LINE: (startPoint, endPoint, color) => (x, y, ctx) => {
        color = [0, 0, 0];
        ctx.strokeStyle = `rgb(${color.join(", ")})`;
        ctx.beginPath();
        ctx.moveTo(startPoint[0] * camera.zoom - camera.x, startPoint[1] * camera.zoom - camera.y);
        ctx.lineTo(endPoint[0] * camera.zoom - camera.x, endPoint[1] * camera.zoom - camera.y);
        ctx.stroke();
    },
    PIXEL_LINE: (startPoint, endPoint, color) => (x, y, ctx) => {
        color = local_player.selectedColor;
        const dx = endPoint[0] - startPoint[0];
        const dy = endPoint[1] - startPoint[1];
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const xIncrement = dx / steps;
        const yIncrement = dy / steps;
        let currentX = startPoint[0] + 0.5;
        let currentY = startPoint[1] + 0.5;
        for (let i = 0; i <= steps; i++) {
            ctx.strokeStyle = `rgb(${color.join(", ")})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(Math.floor(currentX) * camera.zoom - camera.x, Math.floor(currentY) * camera.zoom - camera.y, camera.zoom, camera.zoom);
            currentX += xIncrement;
            currentY += yIncrement;
        }
    }
}