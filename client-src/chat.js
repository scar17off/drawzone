export default {
    send: function(message) {
        socket.emit("send", message);
    }
};