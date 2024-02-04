const { getWorldClients } = require("../world/worldManager");

function getPlayersWithIP(ip) {
    const clients = getWorldClients().filter(client => client.ip === ip);
    return clients;
}

module.exports = {
    getPlayersWithIP
}