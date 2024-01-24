import { camera } from "./camera";

const canvas = document.querySelector("canvas");

export const mouse = {
    x: 0, /* pageX */
	y: 0, /* pageY */
	get worldX() { return camera.x * 16 + this.x / (camera.zoom / 16); },
	get worldY() { return camera.y * 16 + this.y / (camera.zoom / 16); },
	get tileX() { return Math.floor(this.worldX / 16); },
	get tileY() { return Math.floor(this.worldY / 16); }
};

function getGameCoordinates(mouseX, mouseY) {
    mouse.x = mouseX;
    mouse.y = mouseY;

    const gameX = mouse.tileX;
    const gameY = mouse.tileY;

    return { x: Math.floor(gameX), y: Math.floor(gameY) };
};

canvas.addEventListener('mousemove', event => {
    const pos = getGameCoordinates(event.pageX, event.pageY);

    document.getElementById("xy-display").innerText = `XY: ${pos.x},${pos.y}`;

    console.log("game position:", pos);
});