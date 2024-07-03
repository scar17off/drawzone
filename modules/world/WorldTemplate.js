const fs = require("fs");
const path = require("path");
const ranks = require("../shared/ranks.json");
const { defaultRank } = require("../player/rankingUtils.js");

const worldsFilePath = path.join(__dirname, "worlds.json");

if(!fs.existsSync(worldsFilePath)) fs.writeFileSync(worldsFilePath, JSON.stringify({}));
const worlds = require(worldsFilePath);

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
        this.updates = [];
        this.lastID = 1;

        // World properties
        this.lineQuota = ranks[defaultRank].lineQuota;
        this.pixelQuota = ranks[defaultRank].pixelQuota;
        this.maxPlayers = 128;
        this.background = [255, 255, 255];
        this.readonly = false;

        this.loadProperties();

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
        if (this.updates.length > 0 && this.clients.length > 0) {
            server.io.to(this.name).emit("bulkUpdate", this.updates);
            this.updates = [];
        }
    }

    /**
     * Loads the properties of the world from the worlds.json file.
     */
    loadProperties() {
        if(worlds[this.name]) {
            const properties = worlds[this.name];
            Object.assign(this, properties);
        }
    }

    /**
     * Sets a property of the world.
     * @param {string} property - The name of the property to set.
     * @param {any} value - The value to set the property to.
     */
    setProperty(property, value) {
        this[property] = value;
        this.save();
    }

    /**
     * Saves the properties of the world to the worlds.json file.
     */
    save() {
        const properties = this.getProperties();
        if(!properties) {
            delete worlds[this.name];
        } else {
            worlds[this.name] = properties;
        }
        
        fs.writeFileSync(worldsFilePath, JSON.stringify(worlds, null, 4));
    }

    /**
     * Returns the properties of the world.
     * @returns {Object|null} The properties of the world or null if all properties are default.
     */
    getProperties() {
        const defaultProperties = {
            maxPlayers: 128,
            background: [255, 255, 255],
            readonly: false,
            lineQuota: this.lineQuota,
            pixelQuota: this.pixelQuota,
        };

        if (this.maxPlayers === defaultProperties.maxPlayers &&
            JSON.stringify(this.background) === JSON.stringify(defaultProperties.background) &&
            this.readonly === defaultProperties.readonly &&
            this.lineQuota === defaultProperties.lineQuota &&
            this.pixelQuota === defaultProperties.pixelQuota) {
            return null;
        }

        return {
            name: this.name,
            maxPlayers: this.maxPlayers,
            background: this.background,
            readonly: this.readonly,
            lineQuota: this.lineQuota,
            pixelQuota: this.pixelQuota,
        };
    }
}

module.exports = WorldTemplate;