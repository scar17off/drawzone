const { getWorldByName } = require("../world/worldManager.js");
const ranks = require("../shared/ranks.json");
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
        this.id = null;
        this.x = 0;
        this.y = 0;
        this.pixelQuota = null;

        const world = getWorldByName(this.world);
        
        if(world.isFull()) {
            this.send("The world is full.");
            this.ws.close();
        } else {
            world.clients.push(this);
            
            this.setId(world.clients.length);
            this.setRank(ranks[defaultRank].id);
            
            const rankData = getRankByID(this.rank);
            this.pixelQuota = new Bucket(rankData.pixelQuota[0], rankData.pixelQuota[1]);

            this.send(`[Server] Joined world: "${this.world}", your ID is: ${this.id}!`);
            this.send(server.config.welcomeMessage);
        }

        this.ws.on("disconnect", () => {
            const index = world.clients.indexOf(this);
            if(index !== -1) world.clients.splice(index, 1);
        });
    }
    setId(id) {
        this.id = id;
    }
    send(message) {
        this.ws.emit("message", message);
    }
    setRank(id) {
        const rankData = getRankByID(id);

        this.rank = id;
        this.pixelQuota = new Bucket(rankData.pixelQuota[0], rankData.pixelQuota[1]);

        this.ws.emit("newRank", id);
        this.ws.emit("newPixelQuota", rankData.pixelQuota[0], rankData.pixelQuota[1]);

        const greeting = rankData.greetingMessage;
        if(typeof greeting !== "undefined" && greeting !== '') this.send(greeting);
    }
    kick() {
        this.ws.close();
    }
}

module.exports = Client;