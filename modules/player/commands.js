const rankUtil = require("./rankingUtils.js");
const ranks = require("../shared/ranks.json");

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
        nickname = nickname.join(" ");
        this.client.nickname = nickname;
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