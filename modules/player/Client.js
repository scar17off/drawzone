const { getWorldByName } = require("../world/getWorldByName");
const ranks = require("./ranks.json");
var defaultRank;

for(const key in ranks) {
    if(ranks.hasOwnProperty(key) && ranks[key].default) {
        defaultRank = key;
        break;
    };
};

class Client {
    constructor(ws) {
        this.rank = defaultRank;
        this.world = new URL(ws.handshake.headers.referer).pathname.substring(1) || "main";
        this.ws = ws;

        const world = getWorldByName(this.world);
        
        if(world.isFull()) {
            this.send("The world if full.");
            this.ws.close();
        } else {
            this.send(server.config.welcomeMessage);
            world.clients.push(this);
        };

        this.ws.on("disconnect", () => {
            const index = world.clients.indexOf(this);
            if(index !== -1) world.clients.splice(index, 1);
        });
    };
    send(message) {
        this.ws.emit("message", message);
    };
    kick() {
        this.ws.close();
    };
};

module.exports = Client;