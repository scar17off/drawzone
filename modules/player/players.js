function getPlayersWithIP(ip) {
    return getAllPlayers().filter(client => client.ip === ip);
}

function getPlayersInWorld(worldName) {
    worldName = worldName || "main";
    if (worldName) {
        const world = server.worlds.find(w => w.name === worldName);
        return world ? world.clients : [];
    } else {
        throw new Error("World name is required");
    }
}

function getAllPlayers() {
    return server.worlds.flatMap(world => world.clients);
}

module.exports = {
    getPlayersWithIP,
    getPlayersInWorld,
    getAllPlayers
} 