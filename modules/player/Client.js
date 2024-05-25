const { getWorldByName } = require("../world/worldManager.js");
const ranks = require("../shared/ranks.json");
const Bucket = require("./Bucket.js");
const { defaultRank, getRankByID } = require("./rankingUtils.js");

/**
 * Represents a client connected to the server.
 */
class Client {
    /**
     * Creates an instance of a Client.
     * @param {Object} ws - The WebSocket connection for the client.
     */
    constructor(ws) {
        /**
         * The world the client is currently in.
         * @type {string}
         */
        this.world = ws.handshake.headers.referer ? new URL(ws.handshake.headers.referer).pathname.substring(1) : "main";
        /**
         * The WebSocket connection for the client.
         * @type {Object}
         */
        this.ws = ws;
        /**
         * The IP address of the client.
         * @type {string}
         */
        this.ip = ws.handshake.address;
        /**
         * The nickname of the client.
         * @type {?string}
         */
        this.nickname = null;
        /**
         * The color of the client in RGB format.
         * @type {number[]}
         */
        this.color = [0, 0, 0];
        /**
         * The rank of the client.
         * @type {number}
         */
        this.rank = defaultRank;
        /**
         * The tool the client is currently using.
         * @type {number}
         */
        this.tool = 0;
        /**
         * The unique identifier of the client.
         * @type {?number}
         */
        this.id = null;
        /**
         * The x-coordinate of the client in the world.
         * @type {number}
         */
        this.x = 0;
        /**
         * The y-coordinate of the client in the world.
         * @type {number}
         */
        this.y = 0;
        /**
         * The line drawing quota for the client.
         * @type {Bucket}
         */
        this.lineQuota = new Bucket(0, 0);
        /**
         * The pixel drawing quota for the client.
         * @type {Bucket}
         */
        this.pixelQuota = new Bucket(0, 0);
        /**
         * The buffer for storing updates before flushing.
         * @type {any[]}
         */
        this.updateBuffer = [];
        /**
         * The timestamp of the last update buffer flush.
         * @type {number}
         */
        this.lastFlushTime = Date.now();

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
                const rankData = getRankByID(this.rank);
                const rankQuota = rankData && rankData[quotaType] ? rankData[quotaType] : [0, 0];
                this[quotaType] = new Bucket(
                    Math.max(worldQuota[0], rankQuota[0]),
                    Math.min(worldQuota[1], rankQuota[1])
                );
            });
            
            this.send(server.config.welcomeMessage);

            this.setRank(ranks[defaultRank].id);
            this.send(`[Server] Joined world: "${this.world || "main"}", your ID is: ${this.id}!`);
        }

        this.ws.on("disconnect", () => {
            const index = world.clients.indexOf(this);
            if(index !== -1) world.clients.splice(index, 1);
        });
    }

    /**
     * Adds an update to the update buffer and flushes updates if conditions are met.
     * @param {any} update - The update to add to the buffer.
     */
    addUpdate(update) {
        this.updateBuffer.push(update);
        if (this.updateBuffer.length > 8 || Date.now() - this.lastFlushTime > 125) {
            this.flushUpdates();
        }
    }

    /**
     * Flushes the update buffer by emitting a bulk update event and resetting the buffer.
     */
    flushUpdates() {
        if (this.updateBuffer.length > 0) {
            this.ws.emit("bulkUpdate", this.updateBuffer);
            this.ws.broadcast.emit("bulkUpdate", this.updateBuffer);
            this.updateBuffer = [];
            this.lastFlushTime = Date.now();
        }
    }

    /**
     * Sets the client's unique identifier.
     * @param {number} id - The unique identifier to set for the client.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Sends a message to the client.
     * @param {string} message - The message to send.
     */
    send(message) {
        this.ws.emit("message", message);
    }

    /**
     * Sets the client's rank.
     * @param {number} id - The rank ID to set for the client.
     */
    setRank(id) {
        const rankData = getRankByID(id);

        this.rank = rankData.id;
        this.pixelQuota = new Bucket(rankData.pixelQuota[0], rankData.pixelQuota[1]);

        this.ws.emit("newRank", id);
        this.ws.emit("newLineQuota", rankData.lineQuota[0], rankData.lineQuota[1]);
        this.ws.emit("newPixelQuota", rankData.pixelQuota[0], rankData.pixelQuota[1]);

        if(rankData.greetingMessage) this.send(rankData.greetingMessage);
    }

    /**
     * Disconnects the client from the server.
     */
    kick() {
        this.ws.disconnect();
    }

    /**
     * Teleports the client to a specified location.
     * @param {number} x - The x-coordinate to teleport to.
     * @param {number} y - The y-coordinate to teleport to.
     */
    tp(x, y) {
        this.x = x;
        this.y = y;

        this.ws.emit("teleport", x, y);
    }
}

module.exports = Client;