import socket from "./network.js";

const players = {};

const structure = {
    x: 0,
    y: 0,
    color: [0, 0, 0],
    tool: 0
}

socket.on("playerJoin", (id) => {
    players[id] = structure;
})

socket.on("playerLeft", (id) => {
    delete players[id];
})

socket.on("playerUpdate", (id, tool, color) => {
    if(!players[id]) players[id] = structure;
    players[id].tool = tool, players[id].color = color;
})

socket.on("playerMoved", (id, x, y) => {
    if(!players[id]) players[id] = structure;
    players[id].x = x, players[id].y = y;
})

export default players;