const { getWorldByName } = require("../world/getWorldByName");
const ranks = require("./ranks.json");
const Bucket = require("./Bucket.js");
const { defaultRank, getRankByID } = require("./rankingUtils.js");

class Client {
    constructor(ws) {
        this.world = new URL(ws.handshake.headers.referer).pathname.substring(1) || "main";
        this.ws = ws;
        this.nickname = null;
        this.color = [0, 0, 0];
        this.rank = defaultRank;
        this.tool = 0;
        this.rank = 0;
        this.x = 0;
        this.y = 0;
        this.pixelQuota = new Bucket(100, 2);

        const world = getWorldByName(this.world);
        
        if(world.isFull()) {
            this.send("The world is full.");
            this.ws.close();
        } else {
            this.setId(getWorldByName(this.world).getNextID());
            this.setRank(ranks[defaultRank].id);

            this.send(`[Server] Joined world: "${this.world}", your ID is: ${this.id}!`);
            this.send(server.config.welcomeMessage);

            world.clients.push(this);
        }

        this.ws.on("disconnect", () => {
            const index = world.clients.indexOf(this);
            if(index !== -1) world.clients.splice(index, 1);
        })
    }
    setId(id) {
        this.id = id;
    }
    send(message) {
        this.ws.emit("message", message);
    }
    setRank(id) {
        this.rank = id;

        const greeting = getRankByID(id).greetingMessage;
        if(typeof greeting !== "undefined" && greeting !== '') this.send(greeting);
    }
    kick() {
        this.ws.close();
    }
}

module.exports = Client;