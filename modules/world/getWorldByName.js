const fs = require("fs");

const WorldTemplate = require("./WorldTemplate.js");

function getWorldByName(name) {
    if(!name) name = "main";
    var foundWorld;

    for(const World in server.worlds)
        if(World.name == name) foundWorld = World;

    if(!foundWorld) foundWorld = initWorld(name);

    return foundWorld;
};

function initWorld(name) {
    if(!fs.existsSync(`./././worlds/${name}/`))
        fs.mkdirSync(`./././worlds/${name}/`);

    const World = new WorldTemplate(name);

    server.worlds.push(World);

    return World;
};

module.exports = { getWorldByName };