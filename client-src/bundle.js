import chat from "./network/chat.js";
import socket from "./network/network.js";
import { camera } from "./camera.js";
import renderer from "./renderer.js";
import { mouse } from "./mouse.js";
import { chunks, lines, texts } from "./sharedState.js";
import local_player from "./local_player.js";
import tools from "./tools.js";
import players from "./network/players.js";
import events from "./events.js";

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
        chunks,
        lines,
        texts
    },
    mouse,
    player: local_player,
    events,
    players,
    tools
}

export default DrawZone;