import { camera } from "./camera";
import { loadVisibleChunks, unloadInvisibleChunks } from "./network/network";

const canvas = document.querySelector("canvas");

export const mouse = {
    x: 0, /* clientX */
    y: 0, /* clientY */
    mouseX: 0,
    mouseY: 0,
    get tileX() { return this.mouseX / camera.zoom },
    get tileY() { return this.mouseY / camera.zoom },
    buttons: 0
}

canvas.addEventListener('click', event => {
    mouse.buttons = event.buttons;
})

export function getGameCoordinates(clientX, clientY) {
    mouse.x = clientX, mouse.y = clientY;

    const rect = canvas.getBoundingClientRect();
    const offsetX = clientX - rect.left + camera.x;
    const offsetY = clientY - rect.top + camera.y;

    mouse.mouseX = offsetX, mouse.mouseY = offsetY;

    const gameX = offsetX / camera.zoom;
    const gameY = offsetY / camera.zoom;

    return { x: gameX, y: gameY };
}

canvas.addEventListener('mousemove', event => {
    const pos = getGameCoordinates(event.clientX, event.clientY);

    document.getElementById("xy-display").innerText = `XY: ${Math.floor(pos.x)},${Math.floor(pos.y)}`;

    unloadInvisibleChunks();
    loadVisibleChunks();
})