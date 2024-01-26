import chat from "./chat.js";
import socket from "./network.js";
import { camera } from "./camera.js";
import renderer from "./renderer.js";
import { mouse } from "./mouse.js";
import { chunks } from "./sharedState.js";

window.DrawZone = {
    chunks: {},
    chat,
    network: {
        io: socket
    },
    camera,
    renderer,
    world: {
        name: location.pathname.substring(1) || "main",
        chunks
    },
    mouse
};

export default DrawZone;