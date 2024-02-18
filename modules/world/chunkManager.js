const fs = require("fs");
const path = require("path");

const CHUNK_FILL = [255, 255, 255];
const CHUNK_SIZE = 16;

const getWorldDir = worldName => typeof worldName !== 'string' ? (() => { throw new Error('worldName must be a string!'); })() : path.join(__dirname, '../../worlds', worldName);
const ensureWorldDirExists = worldDir => { if (!fs.existsSync(worldDir)) fs.mkdirSync(worldDir, { recursive: true }); };
const getChunkFilePath = (worldName, chunkX, chunkY) => { const worldDir = getWorldDir(worldName); ensureWorldDirExists(worldDir); return path.join(worldDir, `chunk_${chunkX}_${chunkY}.json`); };

function get_chunkdata(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);

    if (fs.existsSync(chunkPath)) {
        const chunkData = JSON.parse(fs.readFileSync(chunkPath, "utf8"));
        return chunkData;
    } else {
        const emptyChunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => CHUNK_FILL));
        return emptyChunkData;
    }
}

function initChunk(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    const chunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => CHUNK_FILL));

    fs.writeFileSync(chunkPath, JSON.stringify(chunkData));

    return chunkData;
}

function set_chunkdata(worldName, chunkX, chunkY, chunkData) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    if (!fs.existsSync(chunkPath)) {
        initChunk(worldName, chunkX, chunkY);
    }
    fs.writeFileSync(chunkPath, JSON.stringify(chunkData));
}

function get_protection(worldName, chunkX, chunkY) {
    const protectionPath = path.join(getWorldDir(worldName), `protection_${chunkX}_${chunkY}.bool`);

    if(fs.existsSync(protectionPath)) {
        return fs.readFileSync(protectionPath, "utf8") === "true";
    } else {
        return false;
    }
}

function set_protection(worldName, chunkX, chunkY, value) {
    const protectionPath = path.join(getWorldDir(worldName), `protection_${chunkX}_${chunkY}.bool`);

    fs.writeFileSync(protectionPath, value.toString());
}

function set_rgb(worldName, chunkX, chunkY, rgb) {
    const newChunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => rgb));
    set_chunkdata(worldName, chunkX, chunkY, newChunkData);

    return newChunkData;
}

function get_pixel(worldName, x, y) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunkData = get_chunkdata(worldName, chunkX, chunkY);
    const pixelX = Math.floor(x % CHUNK_SIZE);
    const pixelY = Math.floor(y % CHUNK_SIZE);

    return chunkData[pixelX][pixelY];
}

function set_pixel(worldName, x, y, color) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    let pixelX = Math.floor(x % CHUNK_SIZE);
    let pixelY = Math.floor(y % CHUNK_SIZE);
    if (pixelX < 0) pixelX += CHUNK_SIZE;
    if (pixelY < 0) pixelY += CHUNK_SIZE;
    let chunkData = get_chunkdata(worldName, chunkX, chunkY);

    if (!chunkData[pixelX] || !chunkData[pixelX][pixelY]) {
        chunkData = initChunk(worldName, chunkX, chunkY);
    }

    chunkData[pixelX][pixelY] = color;
    set_chunkdata(worldName, chunkX, chunkY, chunkData);
}

module.exports = {
    getWorldDir,
    ensureWorldDirExists,
    initChunk,
    get_chunkdata,
    set_chunkdata,
    set_rgb,
    get_pixel,
    set_pixel,
    get_protection,
    set_protection
}