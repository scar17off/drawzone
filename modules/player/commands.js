const Client = require("./Client.js");
const { getRankByID } = require("./rankingUtils.js");
const ranks = require("../shared/ranks.json");
const { getPlayersInWorld } = require("../player/players.js");
const { sanitizeXSS } = require("../utils.js");
const { getWorldByName } = require("../world/worldManager.js");

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

        if(targetClient) targetClient.kick();
    }
    kickip(ipOrId) {
        if(isNaN(ipOrId)) {
            // kick by IP
            const targetClients = getPlayersInWorld()
                .filter(client => client.ip === ipOrId);
            
            targetClients.forEach(client => client.kick());
        } else {
            // kick by ID
            const targetClient = getPlayersInWorld(this.client.world)
                .find(client => client.id === parseInt(ipOrId));
            
            if(targetClient) targetClient.kick();
        }
    }
    setrank(id, rank) {
        const targetClient = getPlayersInWorld(this.client.world)
            .find(client => client.id === parseInt(id));

        if(targetClient) targetClient.setRank(rank);
    }
    list() {
        const clients = getPlayersInWorld(this.client.world);
        const ranksWithClients = clients.reduce((acc, client) => {
            const rankKey = Object.keys(ranks).find(key => ranks[key].id === client.rank);
            if(!acc[rankKey]) {
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
    tell(id, message) {
        if(id == this.client.id) {
            this.client.send("Cannot send a message to yourself.");
            return;
        }

        const targetClient = getPlayersInWorld(this.client.world)
            .find(client => client.id === parseInt(id));

        if(targetClient) {
            const senderInfo = this.client.nickname ? `${this.client.nickname} (${this.client.id})` : `${this.client.id}`;
            targetClient.send(`[${senderInfo} -> me]: ${message}`);
            this.client.send(`[me -> ${senderInfo}]: ${message}`);
        } else {
            this.client.send(`Player ${id} not found.`);
        }
    }
    world() {
        const action = this.args[0];
        const property = this.args[1];
        const value = this.args.slice(2).join(" ");

        if (action === "set" && property && value) {
            const world = getWorldByName(this.client.world);

            switch (property) {
                case "background":
                    const background = value.split(",").map(Number);
                    if (background.length === 3 && background.every(num => !isNaN(num))) {
                        world.setProperty("background", background);
                        this.client.send(`World ${this.client.world} background set to ${background.join(",")}`);
                    } else {
                        this.client.send("Invalid background value. Use format: 255,255,255");
                    }
                    break;
                case "lineQuota":
                case "pixelQuota":
                    const [rate, per] = value.split("x").map(Number);
                    if (!isNaN(rate) && !isNaN(per)) {
                        world.setProperty(property, { rate, per });
                        this.client.send(`World ${this.client.world} ${property} set to ${rate}x${per}`);
                    } else {
                        this.client.send(`Invalid ${property} value. Use format: 10x100`);
                    }
                    break;
                default:
                    if (world.hasOwnProperty(property)) {
                        world.setProperty(property, value);
                        this.client.send(`World ${this.client.world} ${property} set to ${value}`);
                    } else {
                        this.client.send(`Unknown property: ${property}`);
                    }
                    break;
            }
        } else {
            this.client.send("Invalid command format. Use: /world set <property> <value>");
        }
    }
    join() {
        if (this.args.length === 0) {
            this.client.send("Invalid command format. Use: /join <player> <world>");
            return;
        }

        const targetId = this.args[0];
        const targetWorld = this.args[1] || this.args[0];

        if (this.args.length === 2) {
            const targetClient = getPlayersInWorld(this.client.world)
                .find(client => client.id === parseInt(targetId));

            if (targetClient) {
                targetClient.setWorld(targetWorld);
                targetClient.send(`You have been moved to world ${targetWorld}.`);
                this.client.send(`Player ${targetId} has been moved to world ${targetWorld}.`);
            } else {
                this.client.send(`Player with ID ${targetId} not found.`);
            }
        } else if (this.args.length === 1) {
            this.client.setWorld(targetWorld);
            this.client.send(`You have been moved to world ${targetWorld}.`);
        } else {
            this.client.send("Invalid command format. Use: /join <player> <world>");
        }
    }
    help(page = 1) {
        const commandsPerPage = 10;
        const commands = [
            "/nick <nickname> - Set your nickname.",
            "/tp <player|coordinates> - Teleport to a player or coordinates.",
            "/kick <player|IP> - Kick a player or a player with a specific IP.",
            "/setrank <player> <rank> - Set the rank of a player.",
            "/list - List all players by rank.",
            "/spawn - Teleport to the spawn.",
            "/tell <player> <message> - Send a private message to a player.",
            "/world <action> <property> <value> - Set or get world properties.",
            "/join <player> <world> - Join a world.",
        ];

        const totalPages = Math.ceil(commands.length / commandsPerPage);
        page = Math.max(1, Math.min(page, totalPages)); // Ensure page is within bounds

        const startIndex = (page - 1) * commandsPerPage;
        const endIndex = startIndex + commandsPerPage;

        this.client.send(`Commands Page ${page} of ${totalPages}:`);
        commands.slice(startIndex, endIndex).forEach(command => {
            this.client.send(sanitizeXSS(command));
        });

        if (page < totalPages) {
            this.client.send(`Type /help ${page + 1} to see more commands.`);
        }
    }
}

/**
 * Adds a command to the command object.
 * @param {string} name - The name of the command.
 * @param {function} func - The function to be executed when the command is called.
 */
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