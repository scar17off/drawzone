/**
 * Retrieves all players connected to the server with a specific IP address.
 * @param {string} ip - The IP address to filter the players by.
 * @returns {Array} An array of player objects with the specified IP.
 */
function getPlayersWithIP(ip) {
    return getAllPlayers().filter(client => client.ip === ip);
}

/**
 * Retrieves a player by their ID.
 * @param {number} id - The ID of the player to find.
 * @param {string} [world="main"] - The name of the world to find the player in.
 * @returns {Object} The player object if found, null otherwise.
 */
function getPlayerByID(id, world = "main") {
    return server.worlds.find(w => w.name === world).clients.find(client => client.id === id);
}

/**
 * Retrieves all players present in a specified world.
 * @param {string} [worldName="main"] - The name of the world to find players in.
 * @returns {Array} An array of player objects in the specified world.
 * @throws {Error} If the world name is not provided.
 */
function getPlayersInWorld(worldName) {
    worldName = worldName || "main";
    if(worldName) {
        const world = server.worlds.find(w => w.name === worldName);
        return world ? world.clients : [];
    } else {
        throw new Error("World name is required");
    }
}

/**
 * Retrieves all players connected to the server across all worlds.
 * @returns {Array} An array of all player objects.
 */
function getAllPlayers() {
    return server.worlds.flatMap(world => world.clients);
}

module.exports = {
    getPlayersWithIP,
    getPlayersInWorld,
    getAllPlayers,
    getPlayerByID
} 