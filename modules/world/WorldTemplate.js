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
    }
    isFull() {
        return this.clients.length > this.maxPlayers;
    }
}

module.exports = WorldTemplate;