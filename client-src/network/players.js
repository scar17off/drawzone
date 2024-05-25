import socket from "./network.js";
import { players } from "../sharedState.js";
import events from "../events.js";
import { requestRender } from "../renderer.js";
import world from "../world.js";

const structure = {
    x: 0,
    y: 0,
    color: [0, 0, 0],
    tool: 0
}

function updateTitle() {
    document.title = `DrawZone [${Object.keys(players).length + 1}/${world.name}]`;
}

socket.on("playerJoin", (id) => {
    players[id] = structure;
    events.emit("playerJoined", id);
    requestRender();
    document.getElementById("players-display").innerText = "Players: " + (Object.keys(players).length + 1);
    updateTitle();
});

socket.on("playerLeft", (id) => {
    delete players[id];
    events.emit("playerLeft", id);
    document.getElementById("players-display").innerText = "Players: " + (Object.keys(players).length + 1);
    requestRender();
    updateTitle();
});

socket.on("playerUpdate", (id, tool, color) => {
    if(!players[id]) players[id] = structure;
    players[id].tool = tool, players[id].color = color;
    requestRender();
    events.emit("playerUpdate", id, tool, color);
});

socket.on("playerMoved", (id, x, y) => {
    if(!players[id]) players[id] = structure;
    players[id].x = x, players[id].y = y;
    requestRender();
    events.emit("playerMoved", id, x, y);
});

export default players;