import socket from "./network.js";

const chat = {
    send: function(message) {
        socket.emit("send", message);
        document.getElementById("chat-messages").insertAdjacentHTML("beforeend", 
`<li class="user">
    <span>${message}</span>
</li>`);
    },
    local: function(message) {
        console.log(message);
        document.getElementById("chat-messages").insertAdjacentHTML("beforeend", 
`<li class="user">
    <span>${message}</span>
</li>`);
    }
}

document.getElementById("chat-message").addEventListener("keydown", event => {
    if(event.key == "Enter") {
        const message = document.getElementById("chat-message").value;
        if(message.value == '') return;
        chat.send(message);
        document.getElementById("chat-message").value = '';
    }
})

export default chat;