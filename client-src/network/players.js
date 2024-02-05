import socket from "./network.js";
import { players } from "../sharedState.js";
import events from "../events.js";

const structure = {
    x: 0,
    y: 0,
    color: [0, 0, 0],
    tool: 0
}

socket.on("playerJoin", (id) => {
    players[id] = structure;
    events.emit("playerJoined", id);
    document.getElementById("players-display").innerText = "Players: " + (Object.keys(players).length + 1);
});

socket.on("playerLeft", (id) => {
    delete players[id];
    events.emit("playerLeft", id);
    document.getElementById("players-display").innerText = "Players: " + (Object.keys(players).length + 1);
});

socket.on("playerUpdate", (id, tool, color) => {
    if(!players[id]) players[id] = structure;
    players[id].tool = tool, players[id].color = color;
    events.emit("playerUpdate", id, tool, color);
});

socket.on("playerMoved", (id, x, y) => {
    if(!players[id]) players[id] = structure;
    players[id].x = x, players[id].y = y;
    events.emit("playerMoved", id, x, y);
});

export default players;