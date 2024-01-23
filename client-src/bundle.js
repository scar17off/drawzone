import chat from "./chat.js";
import socket from "./network.js";
import { camera } from "./camera.js";
import renderer from "./renderer.js";

window.DrawZone = {
    chunks: {},
    chat,
    net: {
        io: socket
    },
    camera,
    renderer,
    world: {
        name: location.pathname.substring(1) || "main"
    }
};

export default DrawZone;