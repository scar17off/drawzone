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
import windowSystem from "./windowSystem.js";
import world from "./world.js";
import Fx from "./fx.js";
import ranks from "./shared/ranks.json";
import { cursors } from "./cursors.js";

window.DrawZone = {
    chat,
    network: {
        io: socket
    },
    camera,
    renderer: {
        Fx,
        ...renderer
    },
    world: {
        chunks,
        lines,
        texts,
        ...world
    },
    mouse,
    player: local_player,
    events,
    players,
    tools,
    windowSystem,
    ranks,
    cursors
}

export default DrawZone;