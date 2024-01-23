class WorldTemplate {
    constructor(name) {
        this.name = name;
        this.clients = [];
        this.maxPlayers = 128;
    };
    isFull() {
        return this.clients.length >= this.maxPlayers;
    };
};

module.exports = WorldTemplate;