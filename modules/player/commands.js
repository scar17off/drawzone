const { getRankByID } = require("./rankingUtils.js");
const ranks = require("../shared/ranks.json");
const { getPlayersInWorld } = require("../player/players.js");

// this is for JsDoc
const Client = require("./Client.js");

const loginCommands = Object.values(ranks).reduce((acc, rank) => {
    if(rank.loginCommand) {
        acc.push(rank.loginCommand);
    }
    return acc;
}, []);

class Command {
    /**
     * Creates an instance of Command.
     * @param {Object} client - The client executing the command.
     * @param {string} text - The text of the command.
     */
    constructor(client, text) {
        /** @type {Client} The client executing the command. */
        this.client = client;
        /** @type {Object} A collection of commands. */
        this.commands = {};
        /** @type {string[]} The arguments of the command, split by spaces. */
        this.args = text.split(" ");
        /** @type {string} The command to be executed, extracted from the first argument. */
        this.cmd = this.args[0].replace('/', '');
        this.args.shift();
        /** @type {Object} The rank of the client executing the command. */
        this.rank = getRankByID(this.client.rank);

        if(this.rank.commands.includes(this.cmd) || loginCommands.includes(this.cmd)) {
            if(this[this.cmd]) {
                this[this.cmd].apply(this, this.args);
            }
        }
    }
    nick(...nickname) {
        nickname = nickname.join(" ").trim();

        if(nickname !== '') {
            this.client.nickname = nickname;
            this.client.send("Nickname set to: " + nickname);
        } else {
            this.client.nickname = null;
            this.client.send("Nickname reset");
        }
    }
    tp(...args) {
        if(args.length === 1) {
            // teleport to player by id
            const targetClient = getPlayersInWorld(this.client.world)
                .find(client => client.id === parseInt(args[0]));
            if(targetClient) {
                this.client.tp(targetClient.x, targetClient.y);
            }
        } else if(args.length === 2) {
            // teleport to coordinates
            const [x, y] = args.map(Number);
            if(!isNaN(x) && !isNaN(y)) {
                this.client.tp(x, y);
            }
        } else if(args.length === 3) {
            // teleport another player to a player or coordinates
            const targetClient = getPlayersInWorld(this.client.world)
                .find(client => client.id === parseInt(args[0]));
            if(targetClient) {
                if(isNaN(Number(args[1]))) {
                    // teleport to player by id
                    const destinationClient = getPlayersInWorld(this.client.world)
                        .find(client => client.id === parseInt(args[1]));
                    if(destinationClient) {
                        targetClient.tp(destinationClient.x, destinationClient.y);
                    }
                } else {
                    // teleport to coordinates
                    const [x, y] = args.slice(1).map(Number);
                    if(!isNaN(x) && !isNaN(y)) {
                        targetClient.tp(x, y);
                    }
                }
            }
        }
    }
    kick(id) {
        const targetClient = getPlayersInWorld(this.client.world)
            .find(client => client.id === parseInt(id));

        if (targetClient) targetClient.kick();
    }
    kickip(ipOrId) {
        if (isNaN(ipOrId)) {
            // kick by IP
            const targetClients = getPlayersInWorld()
                .filter(client => client.ip === ipOrId);
            
            targetClients.forEach(client => client.kick());
        } else {
            // kick by ID
            const targetClient = getPlayersInWorld(this.client.world)
                .find(client => client.id === parseInt(ipOrId));
            
            if (targetClient) targetClient.kick();
        }
    }
    setrank(id, rank) {
        const targetClient = getPlayersInWorld(this.client.world)
            .find(client => client.id === parseInt(id));

        if (targetClient) targetClient.setRank(rank);
    }
    list() {
        const clients = getPlayersInWorld(this.client.world);
        const ranksWithClients = clients.reduce((acc, client) => {
            const rankKey = Object.keys(ranks).find(key => ranks[key].id === client.rank);
            if (!acc[rankKey]) {
                acc[rankKey] = [];
            }
            acc[rankKey].push(client.nickname ? `${client.nickname} (${client.id})` : client.id);
            return acc;
        }, {});

        Object.entries(ranksWithClients).forEach(([rankKey, clients]) => {
            this.client.send(`${rankKey} (${clients.length}): ${clients.join(', ')}`);
        });
    }
    spawn() {
        this.client.tp(0, 0);
    }
}

function addCommand(name, func) {
    Command.prototype[name] = func;
}

Object.entries(ranks).forEach(([rank, {loginCommand, id: rankId}]) => {
    if(loginCommand) {
        addCommand(loginCommand, function(password) {
            password = password.toString().trim();
            const correctPassword = server.env[loginCommand];
            if(password !== correctPassword) {
                this.client.send("Incorrect password.");
                return;
            }
            this.client.setRank(rankId);
        });
    }
});

module.exports = { Command, addCommand };