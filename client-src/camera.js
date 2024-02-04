import events from "./events.js";

export const canvas = document.getElementById("gameCanvas");

let mouseDown = false;

export function isVisible(x, y, w, h) {
	if(document.visibilityState === "hidden") return;
	var cx = camera.x;
	var cy = camera.y;
	var czoom = camera.zoom;
	var cw = window.innerWidth;
	var ch = window.innerHeight;
	return x + w > cx && y + h > cy && x <= cx + cw / czoom && y <= cy + ch / czoom;
};

function editZoom(change) {
    let nzoom = change > 0 ? camera.zoom * (1 + Math.abs(change)) : camera.zoom / (1 + Math.abs(change));

    if (nzoom > camera.maxZoom) {
        camera.zoom = camera.maxZoom;
    } else if (nzoom < camera.minZoom) {
        camera.zoom = camera.minZoom;
    } else {
        camera.zoom = Math.round(nzoom);
    }

    events.emit("loadChunks");
}

function zoomIn() {
    editZoom(camera.zoomStrength);
}

function zoomOut() {
    editZoom(-camera.zoomStrength);
}

function handleMouseDown(event) {
    if (event.button === 1) {
        mouseDown = true;
    }

    events.emit("loadChunks");
}

function handleMouseUp() {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (mouseDown) {
        camera.x -= event.movementX;
        camera.y -= event.movementY;
    }

    events.emit("loadChunks");
}

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            camera.y -= 1 * camera.zoom;
            events.emit("loadChunks");
            break;
        case 'ArrowDown':
            camera.y += 1 * camera.zoom;
            events.emit("loadChunks");
            break;
        case 'ArrowLeft':
            camera.x -= 1 * camera.zoom;
            events.emit("loadChunks");
            break;
        case 'ArrowRight':
            camera.x += 1 * camera.zoom;
            events.emit("loadChunks");
            break;
    }
}

function handleWheel(event) {
    if (!event.ctrlKey) {
        event.preventDefault();
        if (event.deltaY < 0) zoomIn();
        else zoomOut();
    };
};

canvas.addEventListener('wheel', handleWheel);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

window.addEventListener('keydown', handleKeyDown);

export var camera = {
    x: 0,
    y: 0,
    zoom: 16,
    minZoom: 8,
    maxZoom: 16,
    zoomStrength: 1,
    editZoom
};