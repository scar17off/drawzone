const WorldTemplate = require("./WorldTemplate.js");
const { ensureWorldDirExists, getWorldDir } = require("./chunkManager.js");

function getWorldByName(worldName) {
    if(!worldName) worldName = "main";
    var foundWorld;

    for(const World in server.worlds)
        if(World.name == worldName) foundWorld = World;

    if(!foundWorld) foundWorld = initWorld(worldName);

    return foundWorld;
};

function initWorld(worldName) {
    const worldDir = getWorldDir(worldName);

    ensureWorldDirExists(worldDir);

    const World = new WorldTemplate(worldName);

    server.worlds.push(World);

    return World;
};

module.exports = { getWorldByName };