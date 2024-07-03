const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 16;

/**
 * Gets the directory path for a given world.
 * @param {string} worldName - The name of the world.
 * @returns {string} The path to the world directory.
 */
const getWorldDir = worldName => path.join(__dirname, "../../worlds/", worldName || "main");

/**
 * Ensures that the world directory exists, creating it if necessary.
 * @param {string} worldDir - The directory path of the world.
 */
const ensureWorldDirExists = worldDir => { if(!fs.existsSync(worldDir)) fs.mkdirSync(worldDir, { recursive: true }); };

/**
 * Constructs the file path for a chunk in a specified world.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @returns {string} The file path for the chunk.
 */
const getChunkFilePath = (worldName, chunkX, chunkY) => {
    worldName = worldName || "main";
    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);
    return path.join(worldDir, `chunk_${chunkX}_${chunkY}.json`);
}

/**
 * Retrieves the chunk data from a file or generates a new chunk if the file does not exist.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @returns {Array<Array<number[]>>} The chunk data.
 */
function get_chunkdata(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);

    if(fs.existsSync(chunkPath)) {
        const chunkData = JSON.parse(fs.readFileSync(chunkPath, "utf8"));
        return chunkData;
    } else {
        const emptyChunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => server.worlds.find(world => world.name === worldName).background));
        return emptyChunkData;
    }
}

/**
 * Initializes a new chunk with default data and writes it to a file.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @returns {Array<Array<number[]>>} The initialized chunk data.
 */
function initChunk(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    const chunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => server.worlds.find(world => world.name === worldName).background));

    fs.writeFileSync(chunkPath, JSON.stringify(chunkData));

    return chunkData;
}

/**
 * Sets the chunk data for a specified chunk, deleting the file if the chunk is all white.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @param {Array<Array<number[]>>} chunkData - The data to write to the chunk.
 */
function set_chunkdata(worldName, chunkX, chunkY, chunkData) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    // this is experimental space saving feature, may be disabled in the future
    const isAllWhite = chunkData.every(row => row.every(pixel => pixel.every(value => value === 255)));
    if(isAllWhite) {
        if(fs.existsSync(chunkPath)) {
            fs.unlinkSync(chunkPath);
        }
    } else {
        fs.writeFileSync(chunkPath, JSON.stringify(chunkData));
    }
}

/**
 * Retrieves the protection status of a chunk.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @returns {boolean} True if the chunk is protected, false otherwise.
 */
function get_protection(worldName, chunkX, chunkY) {
    const protectionPath = path.join(getWorldDir(worldName), `protection_${chunkX}_${chunkY}.bool`);

    if(fs.existsSync(protectionPath)) {
        return fs.readFileSync(protectionPath, "utf8") === "true";
    } else {
        return false;
    }
}

/**
 * Sets the protection status of a chunk.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @param {boolean} value - The protection status to set.
 */
function set_protection(worldName, chunkX, chunkY, value) {
    const protectionPath = path.join(getWorldDir(worldName), `protection_${chunkX}_${chunkY}.bool`);

    if(value) {
        fs.writeFileSync(protectionPath, value.toString());
    } else {
        if(fs.existsSync(protectionPath)) {
            fs.unlinkSync(protectionPath);
        }
    }
}

/**
 * Sets all pixels in a chunk to a specified RGB color.
 * @param {string} worldName - The name of the world.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @param {number[]} rgb - The RGB color to set.
 * @returns {Array<Array<number[]>>} The new chunk data.
 */
function set_rgb(worldName, chunkX, chunkY, rgb) {
    const newChunkData = Array.from({ length: CHUNK_SIZE }, () => Array.from({ length: CHUNK_SIZE }, () => rgb));
    set_chunkdata(worldName, chunkX, chunkY, newChunkData);

    return newChunkData;
}

/**
 * Retrieves the color of a specific pixel in a chunk.
 * @param {string} worldName - The name of the world.
 * @param {number} x - The x-coordinate of the pixel.
 * @param {number} y - The y-coordinate of the pixel.
 * @returns {number[]} The RGB color of the pixel.
 */
function get_pixel(worldName, x, y) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunkData = get_chunkdata(worldName, chunkX, chunkY);
    const pixelX = Math.floor(x % CHUNK_SIZE);
    const pixelY = Math.floor(y % CHUNK_SIZE);

    return chunkData[pixelX][pixelY];
}

/**
 * Sets the color of a specific pixel in a chunk.
 * @param {string} worldName - The name of the world.
 * @param {number} x - The x-coordinate of the pixel.
 * @param {number} y - The y-coordinate of the pixel.
 * @param {number[]} color - The RGB color to set for the pixel.
 */
function set_pixel(worldName, x, y, color) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    let pixelX = Math.floor(x % CHUNK_SIZE);
    let pixelY = Math.floor(y % CHUNK_SIZE);
    if(pixelX < 0) pixelX += CHUNK_SIZE;
    if(pixelY < 0) pixelY += CHUNK_SIZE;
    let chunkData = get_chunkdata(worldName, chunkX, chunkY);

    if(!chunkData[pixelX] || !chunkData[pixelX][pixelY]) {
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