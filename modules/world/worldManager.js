const WorldTemplate = require("./WorldTemplate.js");
const { ensureWorldDirExists, getWorldDir } = require("./chunkManager.js");

function initWorld(worldName) {
    const worldDir = getWorldDir(worldName);

    ensureWorldDirExists(worldDir);

    const World = new WorldTemplate(worldName);

    server.worlds.push(World);

    return World;
}

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