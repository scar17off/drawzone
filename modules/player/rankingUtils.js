const ranks = require("../shared/ranks.json");

var defaultRank;

for(const key in ranks) {
    if(ranks[key].loginCommand) server[ranks[key].loginCommand] = process.env[ranks[key].loginCommand];
    if(ranks.hasOwnProperty(key) && ranks[key].default) {
        defaultRank = key;
        break;
    }
}

function getRankByID(rankId) {
    for(const key in ranks) {
        if(ranks.hasOwnProperty(key) && ranks[key].id === rankId) {
            return ranks[key];
        }
    }
}

module.exports = {
    defaultRank,
    getRankByID
}