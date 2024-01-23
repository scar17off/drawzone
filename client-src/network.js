const socket = io();

socket.on("connect", () => {
    console.log("Connected!");

    socket.on("message", message => {
        console.log(message);
    });
});

export default socket;