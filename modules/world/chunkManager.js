const fs = require("fs");
const path = require("path");

const CHUNK_FILL = [255, 255, 255];
const CHUNK_SIZE = 16;

const getWorldDir = (worldName) => path.join(__dirname, "../../worlds", worldName, "pixels");
const ensureWorldDirExists = (worldDir) => { if (!fs.existsSync(worldDir)) fs.mkdirSync(worldDir, { recursive: true }); };

function getChunkFilePath(worldName, chunkX, chunkY) {
    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);
    return path.join(worldDir, `chunk_${chunkX}_${chunkY}.json`);
}

function getChunkData(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);

    if (fs.existsSync(chunkPath)) {
        const chunkData = JSON.parse(fs.readFileSync(chunkPath, "utf8"));
        return chunkData;
    } else {
        const emptyChunkData = new Array(CHUNK_SIZE).fill(null).map(() =>
            new Array(CHUNK_SIZE).fill(CHUNK_FILL)
        );
        return emptyChunkData;
    }
}

function initChunk(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    const chunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => CHUNK_FILL));

    fs.writeFileSync(chunkPath, JSON.stringify(chunkData));

    return chunkData;
}

function setChunkData(worldName, chunkX, chunkY, chunkData) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    fs.writeFileSync(chunkPath, JSON.stringify(chunkData));
}

function set_rgb(worldName, chunkX, chunkY, rgb) {
    const newChunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => rgb));
    setChunkData(worldName, chunkX, chunkY, newChunkData);
}

function get_pixel(worldName, x, y) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunkData = getChunkData(worldName, chunkX, chunkY);
    const pixelX = Math.floor(x % CHUNK_SIZE);
    const pixelY = Math.floor(y % CHUNK_SIZE);

    return chunkData[pixelX][pixelY];
}

function set_pixel(worldName, x, y, color) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const pixelX = Math.floor(x % CHUNK_SIZE);
    const pixelY = Math.floor(y % CHUNK_SIZE);
    var chunkData = getChunkData(worldName, chunkX, chunkY);
    if(!chunkData[pixelX] || !chunkData[pixelX][pixelY]) chunkData = initChunk(worldName, chunkX, chunkY);

    console.log(chunkX, chunkY, pixelX, pixelY, '', x, y);
    chunkData[pixelX][pixelY] = color;
    setChunkData(worldName, chunkX, chunkY, chunkData);
}

module.exports = {
    getWorldDir,
    ensureWorldDirExists,
    initChunk,
    getChunkData,
    setChunkData,
    set_rgb,
    get_pixel,
    set_pixel
};