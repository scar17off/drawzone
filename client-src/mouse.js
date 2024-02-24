import { camera } from "./camera.js";
import world from "./world.js";

const canvas = document.getElementById("gameCanvas");

export const mouse = {
    x: 0, /* clientX */
    y: 0, /* clientY */
    mouseX: 0,
    mouseY: 0,
    prevTileX: 0,
    prevTileY: 0,
    get tileX() { return this.mouseX / camera.zoom },
    get tileY() { return this.mouseY / camera.zoom },
    prevLineX: null,
    prevLineY: null,
    lineX: null,
    lineY: null,
    buttons: 0
}

export function getGameCoordinates(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const offsetX = clientX - rect.left + camera.x;
    const offsetY = clientY - rect.top + camera.y;

    mouse.prevTileX = mouse.tileX, mouse.prevTileY = mouse.tileY;
    mouse.mouseX = offsetX, mouse.mouseY = offsetY;

    const gameX = offsetX / camera.zoom;
    const gameY = offsetY / camera.zoom;

    return { x: gameX, y: gameY };
}

canvas.addEventListener('mousemove', event => {
    mouse.x = event.clientX, mouse.y = event.clientY;

    const pos = getGameCoordinates(event.clientX, event.clientY);
    pos.x = Math.floor(pos.x), pos.y = Math.floor(pos.y);

    document.getElementById("xy-display").innerText = `XY: ${pos.x},${pos.y}`;
    world.move(mouse.tileX, mouse.tileY);
});

canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});