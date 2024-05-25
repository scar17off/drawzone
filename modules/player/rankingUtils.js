const ranks = require("../shared/ranks.json");

/** @type {string|undefined} The default rank identifier */
var defaultRank;

/**
 * Initializes server commands and sets the default rank.
 */
for(const key in ranks) {
    if(ranks[key].loginCommand) {
        // Assign server command based on environment variables
        server[ranks[key].loginCommand] = process.env[ranks[key].loginCommand];
    }
    if(ranks.hasOwnProperty(key) && ranks[key].default) {
        // Set the default rank if it is marked as default in the ranks
        defaultRank = key;
        break;
    }
}

/**
 * Retrieves a rank object by its ID.
 * @param {string} rankId - The ID of the rank to retrieve.
 * @returns {Object|undefined} The rank object if found, otherwise undefined.
 */
const getRankByID = (rankId) => Object.values(ranks).find(rank => rank.id === parseInt(rankId));

module.exports = {
    defaultRank,
    getRankByID
}