const { getWorldByName } = require("../world/worldManager.js");
const ranks = require("../shared/ranks.json");
const Bucket = require("./Bucket.js");
const { defaultRank, getRankByID } = require("./rankingUtils.js");

class Client {
    constructor(ws) {
        this.world = new URL(ws.handshake.headers.referer).pathname.substring(1) || "main";
        this.ws = ws;
        this.ip = ws.handshake.address;
        this.nickname = null;
        this.color = [0, 0, 0];
        this.rank = defaultRank;
        this.tool = 0;
        this.rank = 0;
        this.id = null;
        this.x = 0;
        this.y = 0;
        this.lineQuota = new Bucket(0, 0);
        this.pixelQuota = new Bucket(0, 0);

        const world = getWorldByName(this.world);
        
        if(world.isFull()) {
            this.send("The world is full.");
            this.ws.close();
        } else {
            world.clients.push(this);
            
            this.setId(world.clients.length);
            
            const quotas = ['lineQuota', 'pixelQuota'];
            quotas.forEach(quotaType => {
                const worldQuota = world[quotaType];
                const rankQuota = getRankByID(this.rank)[quotaType] || [0, 0];
                this[quotaType] = new Bucket(
                    Math.max(worldQuota[0], rankQuota[0]),
                    Math.min(worldQuota[1], rankQuota[1])
                );
            });
            
            this.send(server.config.welcomeMessage);

            this.setRank(ranks[defaultRank].id);
            this.send(`[Server] Joined world: "${this.world}", your ID is: ${this.id}!`);
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

        this.rank = rankData.id;
        this.pixelQuota = new Bucket(rankData.pixelQuota[0], rankData.pixelQuota[1]);

        this.ws.emit("newRank", id);
        this.ws.emit("newLineQuota", rankData.lineQuota[0], rankData.lineQuota[1]);
        this.ws.emit("newPixelQuota", rankData.pixelQuota[0], rankData.pixelQuota[1]);

        if(rankData.greetingMessage) this.send(rankData.greetingMessage);
    }
    kick() {
        this.ws.disconnect();
    }
    tp(x, y) {
        this.x = x;
        this.y = y;

        this.ws.emit("teleport", x, y);
    }
}

module.exports = Client;