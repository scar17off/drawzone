import socket from "./network.js";
import { players } from "../sharedState.js";
import events from "../events.js";
import { requestRender } from "../render/renderer.js";
import world from "../world.js";
import local_player from "../local_player.js";

const structure = {
    x: 0,
    y: 0,
    color: [0, 0, 0],
    tool: 0
}

function updateTitle() {
    const playerCount = Object.keys(players).length;
    document.title = `DrawZone [${playerCount + 1}/${world.name}]`;
    if(playerCount === 1) document.title = "DrawZone";
}

socket.on("bulkUpdate", updates => {
    updates.forEach(update => {
        switch (update.type) {
            case "playerJoin":
                const idJoin = update.id;
                if(idJoin === local_player.id) return;

                players[idJoin] = structure;
                events.emit("playerJoined", idJoin);
                requestRender();
                document.getElementById("players-display").innerText = "Players: " + (Object.keys(players).length + 1);
                updateTitle();

                break;
            case "playerLeft":
                const idLeft = update.id;
                if(idLeft === local_player.id) return;

                delete players[idLeft];
                events.emit("playerLeft", idLeft);
                document.getElementById("players-display").innerText = "Players: " + (Object.keys(players).length + 1);
                requestRender();
                updateTitle();

                break;
            case "playerUpdate":
                const { id: idUpdate, tool, color } = update;
                if(idUpdate === local_player.id) return;

                if (!players[idUpdate]) players[idUpdate] = structure;
                players[idUpdate].tool = tool;
                players[idUpdate].color = color;
                requestRender();
                events.emit("playerUpdate", idUpdate, tool, color);
                
                break;
            case "playerMoved":
                const { id: idMoved, x, y } = update;
                if(idMoved === local_player.id) return;

                if (!players[idMoved]) players[idMoved] = structure;
                players[idMoved].x = x;
                players[idMoved].y = y;
                requestRender();
                events.emit("playerMoved", idMoved, x, y);

                break;
        }
    });
});

export default players;