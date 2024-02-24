const { getWorldClients } = require("../world/worldManager");

function getPlayersWithIP(ip) {
    return getWorldClients().filter(client => client.ip === ip);
}

module.exports = {
    getPlayersWithIP
}