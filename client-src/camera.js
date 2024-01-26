export var camera = {
    x: 0,
    y: 0,
    zoom: 16,
    minZoom: 8,
    maxZoom: 16,
    zoomStrength: 1
};

export const canvas = document.getElementById("game");

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

function zoomIn() {
    let nzoom = camera.zoom * (1 + camera.zoomStrength);

    if (nzoom > camera.maxZoom) {
        camera.zoom = camera.maxZoom;
    } else if (nzoom < camera.minZoom) {
        camera.zoom = camera.minZoom;
    } else {
        camera.zoom = Math.round(nzoom);
    }
}

function zoomOut() {
    let nzoom = camera.zoom / (1 + camera.zoomStrength);

    if (nzoom > camera.maxZoom) {
        camera.zoom = camera.maxZoom;
    } else if (nzoom < camera.minZoom) {
        camera.zoom = camera.minZoom;
    } else {
        camera.zoom = Math.round(nzoom);
    }
}

function handleMouseDown() {
    mouseDown = true;
}

function handleMouseUp() {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (mouseDown) {
        camera.x -= event.movementX;
        camera.y -= event.movementY;
    }
}

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            camera.y -= 1 * camera.zoom;
            break;
        case 'ArrowDown':
            camera.y += 1 * camera.zoom;
            break;
        case 'ArrowLeft':
            camera.x -= 1 * camera.zoom;
            break;
        case 'ArrowRight':
            camera.x += 1 * camera.zoom;
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