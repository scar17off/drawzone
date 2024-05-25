const WorldTemplate = require("./WorldTemplate.js");
const { ensureWorldDirExists, getWorldDir } = require("./chunkManager.js");

/**
 * Initializes a new world with the given name.
 * @param {string} worldName - The name of the world to initialize.
 * @returns {Object} The newly created world object.
 */
function initWorld(worldName) {
    const worldDir = getWorldDir(worldName);

    ensureWorldDirExists(worldDir);

    const World = new WorldTemplate(worldName);

    server.worlds.push(World);

    return World;
}

/**
 * Retrieves a world by its name, or initializes it if it doesn't exist.
 * @param {string} worldName - The name of the world to retrieve.
 * @returns {Object} The world object corresponding to the given name.
 */
function getWorldByName(worldName) {
    if(!worldName || worldName == '') worldName = "main";
    var foundWorld;

    foundWorld = server.worlds.find(world => world.name === worldName);

    if(!foundWorld) {
        foundWorld = initWorld(worldName);
    }

    return foundWorld;
}

module.exports = {
    getWorldByName,
    initWorld
}