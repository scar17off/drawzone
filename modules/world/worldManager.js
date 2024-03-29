const WorldTemplate = require("./WorldTemplate.js");
const { ensureWorldDirExists, getWorldDir } = require("./chunkManager.js");

function getWorldByName(worldName) {
    if(!worldName) worldName = "main";
    var foundWorld;

    foundWorld = server.worlds.find(world => world.name === worldName);

    if(!foundWorld) {
        foundWorld = initWorld(worldName);
    }

    return foundWorld;
}

function initWorld(worldName) {
    const worldDir = getWorldDir(worldName);

    ensureWorldDirExists(worldDir);

    const World = new WorldTemplate(worldName);

    server.worlds.push(World);

    return World;
}

function getWorldClients(worldName) {
    if(worldName) {
        const world = server.worlds.find(w => w.name === worldName);
        return world ? world.clients : [];
    } else {
        return server.worlds.flatMap(world => world.clients);
    }
}

module.exports = {
    getWorldByName,
    getWorldClients
}