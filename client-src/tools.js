import local_player from "./local_player.js";
import { mouse } from "./mouse.js";
import { camera } from "./camera.js";
import world from "./world.js";

export const tools = {};

const cursors = {
    cursor: { pos: [0, 0], hotspot: [-5, 0, 2, -6] },
    pencil: { pos: [0, 0], hotspot: [] },
    write: { pos: [0, 0], hotspot: [] },
    move: { pos: [0, 145], hotspot: [-22, -8, -18] },
    fill: { pos: [0, 74], hotspot: [-18, -8, -18] },
    zoom: { pos: [135, 0], hotspot: [-5] },
    camera: { pos: [76, 76], hotspot: [0, 0] },
    eraser: { pos: [76, 152], hotspot: [0, 0] },
    shield: { pos: [152, 0], hotspot: [0, 0] },
    paste: { pos: [152, 76], hotspot: [0, 0] },
    copy: { pos: [152, 152], hotspot: [0, 0] }
}

const toolIDs = Object.keys(cursors).reduce((acc, toolName, index) => {
    acc[toolName] = index;
    return acc;
}, {});

const getToolByName = (name) => ({ name, ...cursors[name] });
const getToolById = (id) => {
    return tools[Object.keys(tools)[id]];
};

const canvas = document.getElementById("gameCanvas");

class Tool {
    constructor(name, icon, fx, minRank, onInit) {
        this.name = name;
        this.elementName = name.toLowerCase();
        this.icon = icon;
        this.minRank = minRank;
        this.fx = fx;
        this.eventListeners = [];
        this.onInit = onInit;
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
        if (currentTool && tool.name !== currentTool.name) {
            currentTool.deactivate();
        }
        local_player.tool = toolIDs[tool.elementName];
        tool.activate();
        removeSelectedClass();
        document.getElementById("tool-" + tool.elementName).classList.add("selected-tool");
    });

    tools[tool.elementName] = tool;

    if(Object.keys(tools).length === 1) document.getElementById("tool-" + tool.elementName).click();
}

// Tool implementations
{
    addTool(new Tool("Cursor", toolIDs.cursor, null, 0, function(tool) {
        tool.setEvent('mousemove', event => {
            if(event.buttons === 1 || event.buttons == 2) {
                const color = event.buttons === 1 ? local_player.selectedColor : [255, 255, 255];
                world.setPixel(mouse.tileX, mouse.tileY, color);
            }
        });
    }));

    addTool(new Tool("Move", toolIDs.move, null, 0, function(tool) {
        tool.setEvent('mousemove', event => {
            if(event.buttons === 1) {
                camera.x -= event.movementX;
                camera.y -= event.movementY;
            }
        });
    }));

    addTool(new Tool("Fill", toolIDs.fill, null, 0, function(tool) {
        let filling = false;

        function colorEquals(color1, color2) {
            return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
        }

        async function bfsFill(x, y, targetColor, fillColor) {
            let queue = [[x, y]];
            while(queue.length > 0 && filling) {
                if(!local_player.pixelQuota.canSpend(1)) await new Promise(resolve => setTimeout(resolve, 100));
                let [cx, cy] = queue.shift();
                const currentColor = await world.getPixel(cx, cy);
                if(colorEquals(currentColor, fillColor) || !colorEquals(currentColor, targetColor)) continue;

                await world.setPixel(cx, cy, fillColor);
                queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
            }
        }

        tool.setEvent('mousedown', async event => {
            if(event.buttons === 1) {
                filling = true;
                const targetColor = await world.getPixel(mouse.tileX, mouse.tileY);
                const fillColor = local_player.selectedColor;
                
                bfsFill(mouse.tileX, mouse.tileY, targetColor, fillColor);
            }
        });
        tool.setEvent('mouseup', event => {
            filling = false;
        });
    }));

    addTool(new Tool("Zoom", toolIDs.zoom, null, 0, function(tool) {
        tool.setEvent('mousedown', event => {
            if (event.buttons === 1) {
                camera.editZoom(0.5);
            } else if (event.buttons === 2) {
                camera.editZoom(-0.5);
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