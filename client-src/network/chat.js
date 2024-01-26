import socket from "./network.js";

export default {
    send: function(message) {
        socket.emit("send", message);
    },
    local: function(message) {
        console.log(message);
    }
}