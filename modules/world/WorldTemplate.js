const ranks = require("../shared/ranks.json");
const { defaultRank } = require("../player/rankingUtils.js");

/**
 * Represents a template for a world in the game.
 */
class WorldTemplate {
    /**
     * Constructs a new WorldTemplate instance.
     * @param {string} name - The name of the world.
     */
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

    /**
     * Determines if the world is full based on the number of clients.
     * @returns {boolean} True if the number of clients exceeds maxPlayers, false otherwise.
     */
    isFull() {
        return this.clients.length >= this.maxPlayers;
    }

    /**
     * Adds an update to the world's update queue.
     * @param {Object} update - The update to add.
     */
    addUpdate(update) {
        this.updates.push(update);
    }

    /**
     * Flushes all pending updates to clients.
     */
    flushUpdates() {
        if (this.updates.length > 0) {
            server.io.to(this.name).emit("bulkUpdate", this.updates);
            this.updates = [];
        }
    }
}

module.exports = WorldTemplate;