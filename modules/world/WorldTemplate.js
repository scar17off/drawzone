const ranks = require("../shared/ranks.json");
const { defaultRank } = require("../player/rankingUtils.js");

class WorldTemplate {
    constructor(name) {
        this.name = name;
        this.clients = [];
        this.maxPlayers = 128;
        this.lastID = 1;
        this.lineQuota = ranks[defaultRank].lineQuota;
        this.pixelQuota = ranks[defaultRank].pixelQuota;
        this.updates = [];

        setInterval(() => {
            this.flushUpdates();
        }, 1000 / 30);
    }
    isFull() {
        return this.clients.length > this.maxPlayers;
    }
    addUpdate(update) {
        this.updates.push(update);
    }
    flushUpdates() {
        if(this.updates.length > 0) {
            server.io.to(this.name).emit("bulkUpdate", this.updates);
            this.updates = [];
        }
    }
}

module.exports = WorldTemplate;