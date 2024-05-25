function getPlayersWithIP(ip) {
    return server.worlds.flatMap(world => world.clients).filter(client => client.ip === ip);
}

function getPlayersInWorld(worldName) {
    if(worldName) {
        const world = server.worlds.find(w => w.name === worldName);
        return world ? world.clients : [];
    } else {
        return server.worlds.flatMap(world => world.clients);
    }
}

module.exports = {
    getPlayersWithIP,
    getPlayersInWorld
}