import local_player from "./local_player.js";

export const tools = {};

const toolsData = [
    { name: "cursor", pos: [0, 0], hotspot: [-5, 0, 2, -6] },
    { name: "move", pos: [0, 74], hotspot: [-28, -8, -18] },
    { name: "fill", pos: [0, 152], hotspot: [0, 0] },
    { name: "lope", pos: [76, 0], hotspot: [0, 0] },
    { name: "camera", pos: [76, 76], hotspot: [0, 0] },
    { name: "eraser", pos: [76, 152], hotspot: [0, 0] },
    { name: "shield", pos: [152, 0], hotspot: [0, 0] },
    { name: "paste", pos: [152, 76], hotspot: [0, 0] },
    { name: "copy", pos: [152, 152], hotspot: [0, 0] }
]

const toolIDs = toolsData.reduce((acc, tool, index) => {
    acc[tool.name] = index;
    return acc;
}, {});

const getToolByName = (name) => toolsData.find(tool => tool.name === name);

const canvas = document.getElementById("gameCanvas");

class Tool {
    constructor(name, icon, fx, minRank) {
        this.name = name;
        this.elementName = name.toLowerCase();
        this.icon = icon;
        this.minRank = minRank;
        this.fx = fx;
        this.eventListeners = [];
    }
    setEvent(event, callback) {
        const eventListener = { event, callback };

        canvas.addEventListener(event, callback);
        this.eventListeners.push(eventListener);
    }
    removeEvents() {
        this.eventListeners.forEach(({ event, callback }) => {
            canvas.removeEventListener(event, callback);
        });

        this.eventListeners = [];
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

    document.getElementById("tools-window").insertAdjacentHTML("beforeend",
`<button id="tool-${tool.elementName}" class="tool-item">
    <div style="background-image: url(/img/toolset.png);
    background-position: ${toolData.pos[0]}px ${toolData.pos[1]}px;
    margin: ${toolData.hotspot.map(h => h + 'px').join(' ')};">
    </div>
</button>`);

    document.getElementById("tool-" + tool.elementName).addEventListener("click", () => {
        local_player.tool = toolIDs[tool.elementName];
        removeSelectedClass();
        document.getElementById("tool-" + tool.elementName).classList.add("selected-tool");
    });

    tools[tool.elementName] = tool;

    if(Object.keys(tools).length === 1) document.getElementById("tool-" + tool.elementName).click();
}

{
    addTool(new Tool("Cursor", null, null, 0, function(tool) {
        tool.setEvent('mousedown mousemove', () => {
            
        });
    }));

    addTool(new Tool("Move", null, null, 0, function(tool) {
        tool.setEvent('mousedown mousemove', () => {
            
        });
    }));
}

export default {
    tools,
    Tool,
    addTool
}