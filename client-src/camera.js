export var camera = {
    x: 0,
    y: 0,
    zoom: 32,
    minZoom: 8,
    maxZoom: 32
};

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

export function centerCameraTo(x, y) {
	if(typeof(x) == "number" && !isNaN(x)){
		camera.x = -(window.innerWidth / camera.zoom / 2) + x;
	}
	
	if(typeof(y) == "number" && !isNaN(y)){
		camera.y = -(window.innerHeight / camera.zoom / 2) + y;
	}
}

function zoomIn() {
    if (camera.zoom * 1.1 > camera.maxZoom) {
        camera.zoom = camera.maxZoom;
    } else {
        camera.zoom *= 1.1;
        camera.zoom = Math.min(camera.zoom, camera.maxZoom);
    }
}

function zoomOut() {
    if (camera.zoom / 1.1 < camera.minZoom) {
        camera.zoom = camera.minZoom;
    } else {
        camera.zoom /= 1.1;
        camera.zoom = Math.max(camera.zoom, camera.minZoom);
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
        camera.x += event.movementX;
        camera.y += event.movementY;
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

const canvas = document.getElementById("game");

canvas.addEventListener('wheel', handleWheel);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

window.addEventListener('keydown', handleKeyDown);