const ranks = require("../shared/ranks.json");

var defaultRank;

for(const key in ranks) {
    if(ranks[key].loginCommand) server[ranks[key].loginCommand] = process.env[ranks[key].loginCommand];
    if(ranks.hasOwnProperty(key) && ranks[key].default) {
        defaultRank = key;
        break;
    }
}

const getRankByID = (rankId) => Object.values(ranks).find(rank => rank.id === parseInt(rankId));

module.exports = {
    defaultRank,
    getRankByID
}