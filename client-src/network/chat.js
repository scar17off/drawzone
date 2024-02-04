import socket from "./network.js";

const sanitizeXSS = (input) => !input ? input : input.replace(/[&<>"'/]/g, (match) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'})[match] || match);

const chat = {
    send: function(message) {
        console.log(message);
        socket.emit("send", message);

        if (message.startsWith('/') && message.split(" ")[0].endsWith('login')) {
            const command = message.split(" ")[0].substring(1);
            const dataToSave = message.split(' ').slice(1).join(' ').replaceAll('"', '');
            localStorage.setItem(command, JSON.stringify(dataToSave).replaceAll('"', ''));
        }        
    },
    local: function(message) {
        console.log(message);
        document.getElementById("chat-messages").insertAdjacentHTML("beforeend", 
        `<li class="user">
            <span>${message}</span>
        </li>`);
    }
}

socket.on("message", message => {
    chat.local(sanitizeXSS(message));
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