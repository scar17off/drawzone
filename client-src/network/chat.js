import socket from "./network.js";


const chat = {
    send: function(message) {
        socket.emit("send", message);

        if(message.startsWith('/') && (message.includes('login') || message.includes('/nick'))) {
            const [command, ...dataParts] = message.substring(1).split(' ');
            const dataToSave = dataParts.join(' ').replaceAll('"', '');
            localStorage.setItem(command, JSON.stringify(dataToSave).replaceAll('"', ''));
        }
    },
    local: function(message) {
        console.log(message);
        document.getElementById("chat-messages").insertAdjacentHTML("beforeend", 
        `<li>
            ${message}
        </li>`);
    }
}

socket.on("message", message => {
    chat.local(message);
});

document.getElementById("chat-message").addEventListener("keydown", event => {
    if(event.key == "Enter") {
        const message = document.getElementById("chat-message").value;
        if(message.value == '') return;
        chat.send(message);
        document.getElementById("chat-message").value = '';
    }
});

export default chat;