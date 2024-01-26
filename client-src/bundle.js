import chat from "./network/chat.js";
import socket from "./network/network.js";
import { camera } from "./camera.js";
import renderer from "./renderer.js";
import { mouse } from "./mouse.js";
import { chunks } from "./sharedState.js";
import local_player from "./local_player.js";
import { cursors } from "./tools.js";
import players from "./network/players.js";

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
    mouse,
    player: local_player,
    cursors,
    events: new EventEmitter(),
    players
}

export default DrawZone;