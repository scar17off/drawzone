import { camera } from "./camera.js";
import local_player from "./local_player.js";
import { mouse } from "./mouse.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export const PLAYERFX = {
    NONE: null,
    RECT_SELECT_ALIGNED: function(size, color) {
        if(!color) color = local_player.selectedColor;

        return function(tool) {
            tool.setEvent('mousemove', () => {
                const startX = Math.floor(mouse.tileX / size) * size;
                const startY = Math.floor(mouse.tileY / size) * size;

                ctx.strokeStyle = `rgb(${color.join(", ")}, 1.0)`;
                ctx.lineWidth = 2;
                ctx.strokeRect(startX * camera.zoom - camera.x, startY * camera.zoom - camera.y, size * camera.zoom, size * camera.zoom);
            });
        }
    }
}