const rankUtil = require("./rankingUtils.js");
const ranks = require("../shared/ranks.json");
const { getWorldClients } = require("../world/worldManager.js");

const loginCommands = Object.values(ranks).reduce((acc, rank) => {
    if(rank.loginCommand) {
        acc.push(rank.loginCommand);
    }
    return acc;
}, []);

class Command {
    constructor(client, text) {
        this.client = client;
        this.commands = {};
        this.args = text.split(" ");
        this.cmd = this.args[0].replace('/', '');
        this.args.shift();
        this.rank = rankUtil.getRankByID(this.client.rank);

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
            const targetClient = getWorldClients(this.client.world)
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
            const targetClient = getWorldClients(this.client.world)
                .find(client => client.id === parseInt(args[0]));
            if(targetClient) {
                if(isNaN(Number(args[1]))) {
                    // teleport to player by id
                    const destinationClient = getWorldClients(this.client.world)
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