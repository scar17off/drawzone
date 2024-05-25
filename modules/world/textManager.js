const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 16;

const getWorldDir = (worldName) => path.join(__dirname, "../../worlds", worldName, "lines");
const ensureWorldDirExists = (worldDir) => { if(!fs.existsSync(worldDir)) fs.mkdirSync(worldDir, { recursive: true }); };

function set_text(worldName, text, x, y) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);

    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);

    const filePath = path.join(worldDir, `text_${chunkX},${chunkY}.json`);

    let texts = {};

    if(fs.existsSync(filePath)) {
        texts = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    texts[`${x},${y}`] = text;

    fs.writeFileSync(filePath, JSON.stringify(texts));
}

function del_text(worldName, x, y) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);

    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);

    const filePath = path.join(worldDir, `text_${chunkX},${chunkY}.json`);

    if(fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

module.exports = {
    set_text,
    del_text
}