const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 16;

const getWorldDir = (worldName) => path.join(__dirname, "../../worlds", worldName, "lines");
const ensureWorldDirExists = (worldDir) => { if (!fs.existsSync(worldDir)) fs.mkdirSync(worldDir, { recursive: true }); };

function draw_line(worldName, from, to) {
    const lineData = [from, to];
    const chunkX1 = Math.floor(from[0] / CHUNK_SIZE);
    const chunkY1 = Math.floor(from[1] / CHUNK_SIZE);
    const chunkX2 = Math.floor(to[0] / CHUNK_SIZE);
    const chunkY2 = Math.floor(to[1] / CHUNK_SIZE);

    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);

    const lineFilePath = path.join(worldDir, `line_${chunkX1},${chunkY1}_${chunkX2},${chunkY2}.json`);
    let lines = [];

    if (fs.existsSync(lineFilePath)) {
        lines = JSON.parse(fs.readFileSync(lineFilePath, "utf8"));
    }

    lines.push(lineData);
    fs.writeFileSync(lineFilePath, JSON.stringify(lines));
}

function erase_line(worldName, from, to) {
    const chunkX1 = Math.floor(from[0] / CHUNK_SIZE);
    const chunkY1 = Math.floor(from[1] / CHUNK_SIZE);
    const chunkX2 = Math.floor(to[0] / CHUNK_SIZE);
    const chunkY2 = Math.floor(to[1] / CHUNK_SIZE);

    const worldDir = getWorldDir(worldName);
    ensureWorldDirExists(worldDir);

    const lineFilePath = path.join(worldDir, `line_${chunkX1},${chunkY1}_${chunkX2},${chunkY2}.json`);

    if (fs.existsSync(lineFilePath)) {
        fs.unlinkSync(lineFilePath);
    }
}

module.exports = {
    draw_line,
    erase_line
}