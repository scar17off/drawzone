const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 16;

function getWorldDir(worldName) {
    if (!worldName) {
        throw new Error('worldName is required');
    }
    return path.join(__dirname, '../../worlds', worldName, 'pixels');
}

function ensureWorldDirExists(worldDir) {
    if (!fs.existsSync(worldDir)) {
        fs.mkdirSync(worldDir, { recursive: true });
    }
}

function getChunkFilePath(worldName, chunkX, chunkY) {
    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);
    return path.join(worldDir, `chunk_${chunkX}_${chunkY}.blob`);
}

function getChunkData(worldName, chunkX, chunkY) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    if (fs.existsSync(chunkPath)) {
        const blob = fs.readFileSync(chunkPath);
        const arrayData = [];
        for (let i = 0; i < blob.length; i += CHUNK_SIZE) {
            arrayData.push(Array.from(blob.slice(i, i + CHUNK_SIZE)));
        }
        return arrayData;
    } else {
        const emptyChunkData = new Array(CHUNK_SIZE).fill(null).map(() => 
            new Array(CHUNK_SIZE).fill([255, 255, 255])
        );
        return emptyChunkData;
    }
}

function setChunkData(worldName, chunkX, chunkY, data) {
    const chunkPath = getChunkFilePath(worldName, chunkX, chunkY);
    const flatData = data.flat();
    const buffer = Buffer.from(flatData);

    fs.writeFileSync(chunkPath, buffer);
}

function initChunk(worldName, chunkX, chunkY) {
    const chunkData = new Array(CHUNK_SIZE);
    for (let x = 0; x < CHUNK_SIZE; x++) {
        chunkData[x] = new Array(CHUNK_SIZE);
        for (let y = 0; y < CHUNK_SIZE; y++) {
            chunkData[x][y] = 255;
        }
    }

    setChunkData(worldName, chunkX, chunkY, chunkData);

    return chunkData;
}

function get_pixel(worldName, x, y) {
    // x, y - game coordinates (not chunk coordinates)
}

function set_pixel(worldName, x, y, color) {
    // x, y - game coordinates (not chunk coordinates), color - e.g. [255, 255, 255]
}

set_pixel("main", 0, 0, [255, 0, 0]);

module.exports = {
    initChunk,
    getChunkData,
    setChunkData,
    get_pixel,
    set_pixel,
    getWorldDir,
    ensureWorldDirExists
};