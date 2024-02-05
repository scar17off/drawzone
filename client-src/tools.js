import local_player from "./local_player.js";
import { mouse } from "./mouse.js";
import { camera } from "./camera.js";
import world from "./world.js";
import Fx from "./fx.js";
import ranks from "./shared/ranks.json";

export const tools = {};

const cursors = {
    cursor: { pos: [0, 0], hotspot: [-5, 0, 2, -6] },
    pencil: { pos: [0, 0], hotspot: [] },
    write: { pos: [0, 0], hotspot: [] },
    move: { pos: [0, 145], hotspot: [-22, -8, -18] },
    fill: { pos: [0, 74], hotspot: [-18, -8, -18] },
    zoom: { pos: [135, 0], hotspot: [-5] },
    camera: { pos: [76, 76], hotspot: [0, 0] },
    eraser: { pos: [135, 66], hotspot: [0, 0] },
    protect: { pos: [62, 0], hotspot: [-4, 0] },
    paste: { pos: [152, 76], hotspot: [0, 0] },
    copy: { pos: [152, 152], hotspot: [0, 0] }
}

export const toolIDs = Object.keys(cursors).reduce((acc, toolName, index) => (acc[toolName] = index, acc), {});
export const getToolByName = name => ({ name, ...cursors[name] });
export const getToolById = id => tools[Object.keys(tools)[id]];

const canvas = document.getElementById("gameCanvas");

class Tool {
    constructor(name, icon, fxRenderer, minRank, onInit) {
        this.name = name;
        this.elementName = name.toLowerCase();
        this.icon = icon;
        this.minRank = minRank;
        this.fxRenderer = { type: fxRenderer[0], params: fxRenderer.slice(1) };
        this.eventListeners = [];
        this.onInit = onInit;
    }
    setFxRenderer(fx) {
        this.fxRenderer = fx;
    }
    addEvents() {
        if (typeof this.onInit === "function") this.onInit(this);
    }
    setEvent(event, callback) {
        const eventListener = { event, callback };
        this.eventListeners.push(eventListener);
    }
    activate() {
        this.eventListeners.forEach(({ event, callback }) => {
            canvas.addEventListener(event, callback);
        });

        if (typeof this.fxRenderer?.type == "number") {
            local_player.currentFxRenderer = this.fxRenderer;
        }
    }
    deactivate() {
        this.eventListeners.forEach(({ event, callback }) => {
            canvas.removeEventListener(event, callback);
        });
    }
}

function removeSelectedClass() {
    const buttons = document.querySelectorAll(".selected-tool");

    buttons.forEach(element => {
        element.classList.remove("selected-tool");
    });
}

function addTool(tool) {
    const toolData = getToolByName(tool.elementName);
    tool.addEvents();

    document.getElementById("tools-window").insertAdjacentHTML("beforeend", `<button id="tool-${tool.elementName}" class="tool-item"><div style="background-image: url(/img/toolset.png); background-position: ${toolData.pos[0]}px ${toolData.pos[1]}px; margin: ${toolData.hotspot.map(h => h + 'px').join(' ')};"></div></button>`);

    document.getElementById("tool-" + tool.elementName).addEventListener("click", () => {
        const currentTool = getToolById(local_player.tool);
        if (currentTool && tool.name !== currentTool.name) currentTool.deactivate();
        local_player.tool = toolIDs[tool.elementName];
        tool.activate();
        removeSelectedClass();
        document.getElementById("tool-" + tool.elementName).classList.add("selected-tool");
    });

    tools[tool.elementName] = tool;

    document.getElementById("tools-window").style.top = `calc(50% - ${document.getElementById("tools-window").clientHeight}px / 2)`;

    if (Object.keys(tools).length === 1) document.getElementById("tool-" + tool.elementName).click();
}

// Tool implementations
{
    addTool(new Tool("Cursor", toolIDs.cursor, [Fx.RECT_SELECT_ALIGNED, 1], ranks.User, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 1 || event.buttons == 2) {
                const color = event.buttons === 1 ? local_player.selectedColor : [255, 255, 255];
                world.setPixel(mouse.tileX, mouse.tileY, color);
            }
        });
    }));

    addTool(new Tool("Pencil", toolIDs.pencil, [Fx.NONE], ranks.User, function (tool) {

    }));

    addTool(new Tool("Write", toolIDs.write, [Fx.NONE], ranks.User, function (tool) {

    }));

    addTool(new Tool("Move", toolIDs.move, [Fx.NONE], ranks.User, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 1) {
                camera.x -= event.movementX;
                camera.y -= event.movementY;
            }
        });
    }));

    addTool(new Tool("Fill", toolIDs.fill, [Fx.NONE], ranks.User, function (tool) {
        let filling = false;

        const colorEquals = (color1, color2) => color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];

        async function bfsFill(x, y, targetColor, fillColor) {
            let queue = [[x, y]];
            while (queue.length > 0 && filling) {
                if (!local_player.pixelQuota.canSpend(1)) await new Promise(resolve => setTimeout(resolve, 100));
                let [cx, cy] = queue.shift();
                const currentColor = await world.getPixel(cx, cy);
                if (colorEquals(currentColor, fillColor) || !colorEquals(currentColor, targetColor)) continue;

                await world.setPixel(cx, cy, fillColor);
                queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
            }
        }

        tool.setEvent('mousedown', async event => {
            if (event.buttons === 1) {
                filling = true;
                const targetColor = await world.getPixel(mouse.tileX, mouse.tileY);
                const fillColor = local_player.selectedColor;

                bfsFill(mouse.tileX, mouse.tileY, targetColor, fillColor);
            }
        });
        tool.setEvent('mouseup', () => {
            filling = false;
        });
    }));

    addTool(new Tool("Zoom", toolIDs.zoom, [Fx.NONE], ranks.User, function (tool) {
        tool.setEvent('mousedown', event => {
            if (event.buttons === 1) {
                camera.editZoom(0.5);
            } else if (event.buttons === 2) {
                camera.editZoom(-0.5);
            }
        });
    }));

    addTool(new Tool("Protect", toolIDs.protect, [Fx.NONE], ranks.Moderator, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 0 || event.buttons === 4) return;
            const chunkX = Math.floor(mouse.tileX / 16);
            const chunkY = Math.floor(mouse.tileY / 16);

            world.setProtection(event.buttons === 1, chunkX, chunkY);
        });
    }));

    addTool(new Tool("Eraser", toolIDs.eraser, [Fx.RECT_SELECT_ALIGNED, 16], ranks.Moderator, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 4 || event.buttons === 0) return;
            const chunkX = Math.floor(mouse.tileX / 16);
            const chunkY = Math.floor(mouse.tileY / 16);

            world.setChunk(event.buttons === 1 ? local_player.selectedColor : [255, 255, 255], chunkX, chunkY);
        });
    }));

    addTool(new Tool("Paste", toolIDs.paste, [Fx.NONE], ranks.Moderator, function (tool) {
        function getImageChunkData(imageData) {
            const chunkData = {};
            const width = imageData.width;
            const height = imageData.height;
            for (let x = 0; x < width; x += 16) {
                for (let y = 0; y < height; y += 16) {
                    const chunkKey = `${Math.floor(x / 16)},${Math.floor(y / 16)}`;
                    chunkData[chunkKey] = Array(16).fill().map(() => Array(16).fill([0, 0, 0, 0]));
                    for (let subX = 0; subX < 16; subX++) {
                        for (let subY = 0; subY < 16; subY++) {
                            const globalX = x + subX;
                            const globalY = y + subY;
                            if (globalX < width && globalY < height) {
                                const index = (globalY * width + globalX) * 4;
                                const r = imageData.data[index];
                                const g = imageData.data[index + 1];
                                const b = imageData.data[index + 2];
                                const a = imageData.data[index + 3];
                                if (globalX % 16 < 16 && globalY % 16 < 16) {
                                    chunkData[chunkKey][globalX % 16][globalY % 16] = [r, g, b, a];
                                }
                            }
                        }
                    }
                }
            }
            return chunkData;
        }

        tool.setEvent('mousedown', async event => {
            if (event.buttons === 1) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async e => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = async function (event) {
                        const img = new Image();
                        img.onload = async function () {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            const imageData = ctx.getImageData(0, 0, img.width, img.height);
                            const chunkData = getImageChunkData(imageData);

                            Object.entries(chunkData).forEach(([chunkKey, chunk]) => {
                                const [chunkX, chunkY] = chunkKey.split(',').map(Number);
                                world.setChunkData(chunkX, chunkY, chunk);
                            });
                        }
                        img.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                }
                input.click();
            }
        });
    }));
}

export default {
    tools,
    Tool,
    addTool,
    cursors
}