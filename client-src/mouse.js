import { camera } from "./camera";
import { loadVisibleChunks, unloadInvisibleChunks } from "./network";

const canvas = document.querySelector("canvas");

export const mouse = {
    x: 0, /* clientX */
	y: 0, /* clientY */
	get worldX() { return camera.x * 16 + this.x / (camera.zoom / 16); },
	get worldY() { return camera.y * 16 + this.y / (camera.zoom / 16); },
	get tileX() { return Math.floor(this.worldX / 16); },
	get tileY() { return Math.floor(this.worldY / 16); }
};

function getGameCoordinates(clientX, clientY) {
    mouse.x = clientX;
    mouse.y = clientY;

    const mouseX = mouse.x - canvas.getBoundingClientRect().left + camera.x;
    const mouseY = mouse.y - canvas.getBoundingClientRect().top + camera.y;

    const gameX = Math.floor(mouseX / camera.zoom);
    const gameY = Math.floor(mouseY / camera.zoom);

    return { x: Math.floor(gameX), y: Math.floor(gameY) };
};

canvas.addEventListener('mousemove', event => {
    const pos = getGameCoordinates(event.clientX, event.clientY);

    document.getElementById("xy-display").innerText = `XY: ${pos.x},${pos.y}`;

    unloadInvisibleChunks();
    loadVisibleChunks();
});