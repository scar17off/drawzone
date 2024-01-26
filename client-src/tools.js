import local_player from "./local_player.js";

export const tools = {};

const toolIDs = {
    "cursor": 0,
    "move": 0
}

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
    })
}

function addTool(tool) {
    document.getElementById("tools-window").insertAdjacentHTML("beforeend",
`<button id="tool-${tool.elementName}" class="tool-item">
    <div style="background-image: url(./img/toolset.png);">
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
            
        })
    }))

    addTool(new Tool("Move", null, null, 0, function(tool) {
        tool.setEvent('mousedown mousemove', () => {
            
        })
    }))
}

export default {
    tools,
    Tool,
    addTool
}