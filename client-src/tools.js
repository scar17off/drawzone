import local_player, { addColor } from "./local_player.js";
import { mouse } from "./mouse.js";
import { camera } from "./camera.js";
import world from "./world.js";
import Fx from "./fx.js";
import ranks from "./shared/ranks.json";
import events from "./events.js";
import { requestRender } from "./render/renderer.js";
import { cursors } from "./cursors.js";
import { options } from "./sharedState.js";

const chunkSize = options.chunkSize;

const canvas = document.getElementById("gameCanvas");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const tools = {};
export const toolIDs = Object.keys(cursors).reduce((acc, toolName, index) => (acc[toolName] = index, acc), {});

class Tool {
    constructor(name, cursor, fxRenderer, minRank, onInit) {
        this.name = name;
        this.elementName = name.toLowerCase().replaceAll(" ", "-");
        this.cursor = cursor;
        this.minRank = minRank.id;
        this.fxRenderer = { type: fxRenderer[0], params: fxRenderer.slice(1) };
        this.eventListeners = [];
        this.id = Object.keys(tools).length;
        if(onInit) this.setToolInit(onInit);
    }
    
    setToolInit(onInit) {
        this.onInit = onInit;
        this.addEvents();
    }
    
    setFxRenderer(fx) {
        this.fxRenderer = fx;
    }
    
    addEvents() {
        if(typeof this.onInit === "function") this.onInit(this);
    }
    
    setEvent(event, callback) {
        const eventListener = { event, callback };

        this.eventListeners.push(eventListener);
    }
    
    activate() {
        this.eventListeners.forEach(({ event, callback }) => {
            canvas.addEventListener(event, callback);
        });

        if(typeof this.fxRenderer?.type == "number") {
            local_player.currentFxRenderer = this.fxRenderer;
        }
    }
    
    deactivate() {
        this.eventListeners.forEach(({ event, callback }) => {
            canvas.removeEventListener(event, callback);
        });
    }
    
    show() {
        const toolButton = document.getElementById(`tool-${this.elementName}`);
        if(toolButton) toolButton.style.display = '';
    }
    
    hide() {
        const toolButton = document.getElementById(`tool-${this.elementName}`);
        if(toolButton) toolButton.style.display = 'none';
    }
}

function removeSelectedClass() {
    const buttons = document.querySelectorAll(".selected-tool");

    buttons.forEach(element => {
        element.classList.remove("selected-tool");
    });
}

function addTool() {
    const tool = new Tool(...arguments);

    const toolButton = document.createElement("button");
    toolButton.id = `tool-${tool.elementName}`;
    toolButton.className = "tool-item";
    const toolImageDiv = document.createElement("div");

    if(!tool.cursor.base64) {
        events.once("toolCtxLoaded", () => {
            toolImageDiv.style.backgroundImage = `url("${tool.cursor.base64}")`;
        });
    } else {
        toolImageDiv.style.backgroundImage = `url("${tool.cursor.base64}")`;
    }

    toolImageDiv.style.margin = tool.cursor?.offset?.join("px ") + "px";

    toolButton.appendChild(toolImageDiv);
    document.getElementById("tools-window").appendChild(toolButton);

    document.getElementById("tool-" + tool.elementName).addEventListener("click", () => {
        const currentTool = Object.values(tools).find(tool => tool.id === local_player.tool);
        if(tool.id !== currentTool.id) currentTool.deactivate();
        local_player.tool = tool.id;
        tool.activate();
        removeSelectedClass();
        document.getElementById("tool-" + tool.elementName).classList.add("selected-tool");

        events.emit("setTool", local_player.tool);
    });

    tools[tool.elementName] = tool;

    document.getElementById("tools-window").style.top = `calc(50% - ${document.getElementById("tools-window").clientHeight}px / 2)`;    

    if(Object.keys(tools).length === 1) document.getElementById("tool-" + tool.elementName).click();

    return tool;
}

events.on("newRank", newRank => {
    Object.values(tools).forEach(tool => {
        if(newRank >= tool.minRank) {
            tool.show();
        } else {
            tool.hide();
        }
    });
});

{
    addTool("Cursor", cursors.cursor, [Fx.RECT_SELECT_ALIGNED, 1], ranks.User, function(tool) {
        function mouseDown(event) {
            if(event.buttons === 1 || event.buttons == 2) {
                const color = event.buttons === 1 ? local_player.selectedColor : [255, 255, 255];
                world.setPixel(mouse.tileX, mouse.tileY, color);
            }
        }
        
        tool.setEvent('mousemove', event => {
            if(event.buttons === 1 || event.buttons == 2) {
                const color = event.buttons === 1 ? local_player.selectedColor : [255, 255, 255];
                world.setPixel(mouse.tileX, mouse.tileY, color);
            }
        });
        tool.setEvent('mousedown', mouseDown);
    });

    addTool("Pipette", cursors.pipette, [Fx.NONE], ranks.User, function(tool) {
        async function mouseDown(event) {
            if(event.buttons === 1) {
                const color = await world.getPixel(mouse.tileX, mouse.tileY);

                const colorExists = local_player.palette.some(existingColor => 
                    existingColor[0] === color[0] && existingColor[1] === color[1] && existingColor[2] === color[2]
                );

                if(!colorExists) addColor(color);
                local_player.selectedColor = color;

                setTimeout(() => {
                    const colorElement = document.querySelector(`.color-item[data-color='${color.join(",")}']`);
                    if(colorElement) {
                        colorElement.click();
                    }
                }, 0);
            }
        }

        tool.setEvent('mousemove', mouseDown);
        tool.setEvent('mousedown', mouseDown);
    });

    addTool("Pencil", cursors.pencil, [Fx.NONE], ranks.User, function(tool) {
        let intervalId = null;
        let drawingStarted = false;

        tool.setEvent('mousemove', event => {
            if(event.buttons === 1) {
                if(!drawingStarted) {
                    drawingStarted = true;
                    mouse.prevLineX = mouse.tileX;
                    mouse.prevLineY = mouse.tileY;
                }

                if(intervalId === null) {
                    intervalId = setInterval(() => {
                        const prevPos = [mouse.prevLineX, mouse.prevLineY];
                        const currPos = [mouse.tileX, mouse.tileY];
                        if(!prevPos[0] || !prevPos[1]) {
                            mouse.prevLineX = currPos[0];
                            mouse.prevLineY = currPos[1];
                        }
                        mouse.lineX = currPos[0];
                        mouse.lineY = currPos[1];

                        world.drawLine(prevPos, currPos);
                        mouse.prevLineX = currPos[0];
                        mouse.prevLineY = currPos[1];
                    }, 1000 / 10);
                }
            } else if(event.buttons === 0) {
                if(intervalId !== null) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                drawingStarted = false;
                mouse.prevLineX = null;
                mouse.prevLineY = null;
            }
        });
    });

    addTool("Line Pencil", cursors.linepencil, [Fx.NONE], ranks.User, function(tool) {
        let startPoint = null;

        tool.setEvent("mousedown", event => {
            if(event.buttons === 1) {
                startPoint = [mouse.tileX, mouse.tileY];
            }
        });

        tool.setEvent("mousemove", event => {
            if(event.buttons === 1 && startPoint) {
                const endPoint = [mouse.tileX, mouse.tileY];
                local_player.currentFxRenderer = {
                    type: Fx.LINE,
                    params: [startPoint, endPoint]
                }
                requestRender();
            }
        });

        tool.setEvent("mouseup", () => {
            if(startPoint) {
                const endPoint = [mouse.tileX, mouse.tileY];
                world.drawLine(startPoint, endPoint);
                startPoint = null;
                local_player.currentFxRenderer = { type: Fx.NONE, params: [] };
                requestRender();
            }
        });
    });

    addTool("Pixel Line", cursors.line, [Fx.NONE], ranks.User, function(tool) {
        let pixelLineStart = null;
        let pixelLineEnd = null;

        tool.setEvent("mousedown", event => {
            if(event.buttons === 1) {
                pixelLineStart = [mouse.tileX, mouse.tileY];
            }
        });

        tool.setEvent("mouseup", () => {
            if(pixelLineStart) {
                pixelLineEnd = [mouse.tileX, mouse.tileY];
                const dx = pixelLineEnd[0] - pixelLineStart[0];
                const dy = pixelLineEnd[1] - pixelLineStart[1];
                const steps = Math.max(Math.abs(dx), Math.abs(dy));
                const xIncrement = dx / steps;
                const yIncrement = dy / steps;

                let x = pixelLineStart[0];
                let y = pixelLineStart[1];

                for (let i = 0; i <= steps; i++) {
                    world.setPixel(Math.round(x), Math.round(y), local_player.selectedColor);
                    x += xIncrement;
                    y += yIncrement;
                }

                requestRender();
                pixelLineStart = null;
                pixelLineEnd = null;
            }
        });
    });

    addTool("Move", cursors.move, [Fx.NONE], ranks.User, function(tool) {
        tool.setEvent('mousemove', event => {
            if(event.buttons === 1) {
                camera.x -= event.movementX;
                camera.y -= event.movementY;
                
                events.emit("loadChunks");
            }
        });
    });

    addTool("Fill", cursors.fill, [Fx.NONE], ranks.User, function(tool) {
        let filling = false;

        const colorEquals = (color1, color2) => color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];

        async function bfsFill(x, y, targetColor, fillColor) {
            let queue = [[x, y]];
            while (queue.length > 0 && filling) {
                if(!local_player.pixelQuota.canSpend(1)) await sleep(100);
                let [cx, cy] = queue.shift();
                const currentColor = await world.getPixel(cx, cy);
                if(colorEquals(currentColor, fillColor) || !colorEquals(currentColor, targetColor)) continue;

                await world.setPixel(cx, cy, fillColor);

                const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                directions.forEach(([dx, dy]) => queue.push([cx + dx, cy + dy]));

                await sleep(1); // prevent lag
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
        tool.setEvent('mouseup', () => {
            filling = false;
        });
    });

    addTool("Zoom", cursors.zoom, [Fx.NONE], ranks.User, function(tool) {
        tool.setEvent('mousedown', event => {
            if(event.buttons === 1) {
                camera.editZoom(0.5);
            } else if(event.buttons === 2) {
                camera.editZoom(-0.5);
            }
        });
    });

    addTool("Protect", cursors.protect, [Fx.NONE], ranks.Moderator, function(tool) {
        const protect = event => {
            if(event.buttons === 0 || event.buttons === 4) return;
            const chunkX = Math.floor(mouse.tileX / chunkSize);
            const chunkY = Math.floor(mouse.tileY / chunkSize);

            world.setProtection(event.buttons === 1, chunkX, chunkY);
        }

        tool.setEvent('mousemove', protect);
        tool.setEvent('mousedown', protect);
    });

    addTool("Eraser", cursors.eraser, [Fx.RECT_SELECT_ALIGNED, chunkSize], ranks.Moderator, function(tool) {
        const erase = event => {
            if(event.buttons === 4 || event.buttons === 0) return;
            const chunkX = Math.floor(mouse.tileX / chunkSize);
            const chunkY = Math.floor(mouse.tileY / chunkSize);

            world.setChunk(event.buttons === 1 ? local_player.selectedColor : [255, 255, 255], chunkX, chunkY);
        }

        tool.setEvent('mousemove', erase);
        tool.setEvent('mousedown', erase);
    });

    addTool("Paste", cursors.paste, [Fx.NONE], ranks.Moderator, function(tool) {
        function getImageChunkData(imageData) {
            const chunkData = {};
            const width = imageData.width;
            const height = imageData.height;

            for (let x = 0; x < width; x += chunkSize) {
                for (let y = 0; y < height; y += chunkSize) {
                    const chunkKey = `${Math.floor(x / chunkSize)},${Math.floor(y / chunkSize)}`;
                    chunkData[chunkKey] = Array(chunkSize).fill().map(() => Array(chunkSize).fill([0, 0, 0, 0]));
                    for (let subX = 0; subX < chunkSize; subX++) {
                        for (let subY = 0; subY < chunkSize; subY++) {
                            const globalX = x + subX;
                            const globalY = y + subY;
                            if(globalX < width && globalY < height) {
                                const index = (globalY * width + globalX) * 4;
                                const r = imageData.data[index];
                                const g = imageData.data[index + 1];
                                const b = imageData.data[index + 2];
                                const a = imageData.data[index + 3];
                                if(globalX % chunkSize < chunkSize && globalY % chunkSize < chunkSize) {
                                    chunkData[chunkKey][globalX % chunkSize][globalY % chunkSize] = [r, g, b, a];
                                }
                            }
                        }
                    }
                }
            }
            return chunkData;
        }

        tool.setEvent('mousedown', async event => {
            if(event.buttons === 1) {
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
                                const [chunkOffsetX, chunkOffsetY] = chunkKey.split(',').map(Number);
                                const baseChunkX = Math.floor(mouse.tileX / chunkSize);
                                const baseChunkY = Math.floor(mouse.tileY / chunkSize);
                                const chunkX = baseChunkX + chunkOffsetX;
                                const chunkY = baseChunkY + chunkOffsetY;

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
    });

    addTool("Paste as Lines", cursors.linepaste, [Fx.NONE], ranks.Admin, function(tool) {
        tool.horizontal = true;
        tool.vertical = true;
        tool.pixel = false;

        function getImageLineData(imageData) {
            const lineData = [];
            const pixelData = [];
            const width = imageData.width;
            const height = imageData.height;

            // Horizontal lines
            if(tool.horizontal) {
                for (let y = 0; y < height; y++) {
                    let startX = 0;
                    let currentColor = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]];
                    for (let x = 1; x < width; x++) {
                        const index = (y * width + x) * 4;
                        const color = [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]];
                        if(color[3] === 0) continue;
                        if(color[0] !== currentColor[0] || color[1] !== currentColor[1] || color[2] !== currentColor[2] || color[3] !== currentColor[3]) {
                            lineData.push({start: [startX, y], end: [x - 1, y], color: currentColor});
                            startX = x;
                            currentColor = color;
                        }
                    }
                    if(currentColor[3] !== 0) {
                        lineData.push({start: [startX, y], end: [width - 1, y], color: currentColor});
                    }
                }
            }

            // Vertical lines
            if(tool.vertical) {
                for (let x = 0; x < width; x++) {
                    let startY = 0;
                    let currentColor = [imageData.data[x * 4], imageData.data[x * 4 + 1], imageData.data[x * 4 + 2], imageData.data[x * 4 + 3]];
                    for (let y = 1; y < height; y++) {
                        const index = (y * width + x) * 4;
                        const color = [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]];
                        if(color[3] === 0) continue;
                        if(color[0] !== currentColor[0] || color[1] !== currentColor[1] || color[2] !== currentColor[2] || color[3] !== currentColor[3]) {
                            lineData.push({start: [x, startY], end: [x, y - 1], color: currentColor});
                            startY = y;
                            currentColor = color;
                        }
                    }
                    if(currentColor[3] !== 0) {
                        lineData.push({start: [x, startY], end: [x, height - 1], color: currentColor});
                    }
                }
            }

            // Handle Pixels
            if(tool.pixel) {
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        const index = (y * width + x) * 4;
                        const color = [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]];
                        if(color[3] !== 0) {
                            pixelData.push({x, y, color});
                        }
                    }
                }
            }

            return { lineData, pixelData };
        }

        tool.setEvent('mousedown', async event => {
            if(event.buttons === 1) {
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
                            const { lineData, pixelData } = getImageLineData(imageData);

                            lineData.forEach(line => {
                                if(line.color[3] !== 0) {
                                    const baseX = Math.floor(mouse.tileX);
                                    const baseY = Math.floor(mouse.tileY);
                                    const from = [baseX + line.start[0], baseY + line.start[1]];
                                    const to = [baseX + line.end[0], baseY + line.end[1]];
                                    world.drawLine(from, to, line.color);
                                }
                            });

                            pixelData.forEach(pixel => {
                                if(pixel.color[3] !== 0) {
                                    const baseX = Math.floor(mouse.tileX);
                                    const baseY = Math.floor(mouse.tileY);
                                    const position = [baseX + pixel.x, baseY + pixel.y];
                                    world.setPixel(position[0], position[1], pixel.color);
                                }
                            });
                        }
                        img.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                }
                input.click();
            }
        });
    });

    addTool("Area Erase", cursors.areaerase, [Fx.NONE], ranks.Moderator, function(tool) {
        let selectionStart = null;
        let selectionEnd = null;
        let step = chunkSize;

        tool.setEvent("mousedown", event => {
            if(event.buttons === 1) {
                selectionStart = [mouse.tileX, mouse.tileY];
            }
        });

        tool.setEvent("mousemove", event => {
            if(event.buttons === 1 && selectionStart) {
                selectionEnd = [mouse.tileX, mouse.tileY];
                local_player.currentFxRenderer = {
                    type: Fx.AREA_SELECT,
                    params: [selectionStart, selectionEnd, step]
                }
                requestRender();
            }
        });

        tool.setEvent("mouseup", async () => {
            if(selectionStart && selectionEnd) {
                const playerColor = local_player.selectedColor;
                const adjustedStartX = step === chunkSize ? Math.floor(selectionStart[0] / step) * step : selectionStart[0];
                const adjustedStartY = step === chunkSize ? Math.floor(selectionStart[1] / step) * step : selectionStart[1];
                const adjustedEndX = step === chunkSize ? Math.floor(selectionEnd[0] / step) * step + (step - 1) : selectionEnd[0];
                const adjustedEndY = step === chunkSize ? Math.floor(selectionEnd[1] / step) * step + (step - 1) : selectionEnd[1];

                if(step === 1) {
                    for (let x = adjustedStartX; x <= adjustedEndX; x++) {
                        for (let y = adjustedStartY; y <= adjustedEndY; y++) {
                            world.setPixel(x, y, playerColor);
                            await sleep(1);
                        }
                    }
                } else if(step === chunkSize) {
                    for (let x = adjustedStartX; x <= adjustedEndX; x += chunkSize) {
                        for (let y = adjustedStartY; y <= adjustedEndY; y += chunkSize) {
                            const chunkX = Math.floor(x / chunkSize);
                            const chunkY = Math.floor(y / chunkSize);
                            world.setChunk(playerColor, chunkX, chunkY);
                            await sleep(3);
                        }
                    }
                }

                selectionStart = null;
                selectionEnd = null;
                local_player.currentFxRenderer = { type: Fx.NONE, params: [] };
                requestRender();
            }
        });
    });

    addTool("Area Protect", cursors.areaprotect, [Fx.NONE], ranks.Moderator, async (tool) => {
        let selectionStart = null;
        let selectionEnd = null;
        let step = chunkSize;

        tool.setEvent("mousedown", event => {
            if(event.buttons === 1 && !selectionStart) {
                selectionStart = [mouse.tileX, mouse.tileY];
            }
        });

        tool.setEvent("mousemove", event => {
            if(event.buttons === 1 && selectionStart) {
                selectionEnd = [mouse.tileX, mouse.tileY];
                local_player.currentFxRenderer = {
                    type: Fx.AREA_SELECT,
                    params: [selectionStart, selectionEnd, step]
                }
                requestRender();
            }
        });

        tool.setEvent("mousedown", async (event) => {
            if(selectionStart && selectionEnd) {
                const adjustedStartX = Math.floor(selectionStart[0] / chunkSize) * chunkSize;
                const adjustedStartY = Math.floor(selectionStart[1] / chunkSize) * chunkSize;
                const adjustedEndX = Math.floor((selectionEnd[0] / chunkSize)) * chunkSize + 15;
                const adjustedEndY = Math.floor((selectionEnd[1] / chunkSize)) * chunkSize + 15;

                const protectValue = event.buttons === 1; // left click to protect, right click to unprotect

                for (let x = adjustedStartX; x <= adjustedEndX; x += chunkSize) {
                    for (let y = adjustedStartY; y <= adjustedEndY; y += chunkSize) {
                        const chunkX = Math.floor(x / chunkSize);
                        const chunkY = Math.floor(y / chunkSize);
                        world.setProtection(protectValue, chunkX, chunkY);
                        await sleep(0);
                    }
                }

                selectionStart = null;
                selectionEnd = null;
                local_player.currentFxRenderer = { type: Fx.NONE, params: [] };
                requestRender();
            }
        });
    });

    addTool("Screenshot", cursors.camera, [Fx.NONE], ranks.User, function(tool) {
        let selectionStart = null;
        let selectionEnd = null;

        async function captureAndOpenScreenshot(start, end) {
            const width = Math.abs(end[0] - start[0]) + 1;
            const height = Math.abs(end[1] - start[1]) + 1;
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
        
            for (let x = start[0]; x <= end[0]; x++) {
                for (let y = start[1]; y <= end[1]; y++) {
                    const color = await world.getPixel(x, y);
                    ctx.fillStyle = `rgb(${color.join(',')})`;
                    ctx.fillRect(x - start[0], y - start[1], 1, 1);
                }
            }
        
            const dataUrl = canvas.toDataURL();
            displayImageInModal(dataUrl);
        }
        
        function displayImageInModal(imageSrc) {
            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.left = "0";
            modal.style.top = '0';
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.zIndex = "1000";
        
            const img = document.createElement("img");
            img.src = imageSrc;
            img.style.maxWidth = "90%";
            img.style.maxHeight = "90%";
        
            const closeButton = document.createElement("button");
            closeButton.textContent = "Close";
            closeButton.onclick = function() {
                document.body.removeChild(modal);
            }
        
            modal.appendChild(img);
            modal.appendChild(closeButton);
            document.body.appendChild(modal);
        }
    
        tool.setEvent("mousedown", event => {
            if(event.buttons === 1) {
                selectionStart = [mouse.tileX, mouse.tileY];
            }
        });
    
        tool.setEvent("mousemove", event => {
            if(event.buttons === 1 && selectionStart) {
                selectionEnd = [mouse.tileX, mouse.tileY];
                local_player.currentFxRenderer = {
                    type: Fx.AREA_SELECT,
                    params: [selectionStart, selectionEnd, 1]
                }
                requestRender();
            }
        });
    
        tool.setEvent("mouseup", () => {
            if(selectionStart && selectionEnd) {
                captureAndOpenScreenshot(selectionStart, selectionEnd);
                selectionStart = null;
                selectionEnd = null;
            }
        });
    });
}

export default {
    tools,
    Tool,
    addTool,
}