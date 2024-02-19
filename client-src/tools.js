import local_player, { addColor } from "./local_player.js";
import { mouse } from "./mouse.js";
import { camera } from "./camera.js";
import world from "./world.js";
import Fx from "./fx.js";
import ranks from "./shared/ranks.json";
import events from "./events.js";
import { requestRender } from "./renderer.js";

// this is shit
export const cursors = {
    cursor: { base64: "data:image/png;base64,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", offset: [-2] },
    pipette: { base64: "data:image/png;base64,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", offset: [-8] },
    pencil: { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAYUSURBVHhe7Ztn6LZTHMcfe2bPjEjZIlsiKyOjSETIKrJHISJJyHqBxAs7ISs7M6PMF1aZIXtFVlbW5/P8r2+dHvf1v/LCi/v33N/6dN/P777OU7/v/5xzXb9zzjVjookmmmiiicZWc3SfVWV+c059nfEX/D31dSIVY1qNik2rubrPajIve8xCcApsAa/A76BJs3VPyh99AXgUNEPugfSg/9yTqiiJa9J9oDHPwvPd9+shqj7//kttr7gVNORNWApWgs+62Nmgqk4vI9Wacy1oxPuwqoFO28Af4G8HGUCzhUntULkcNOBTWMsAmhtixL7g77KHAVTaJM2JQReAiX8DGxpAmhPFiKPB636GXFdy0m4fAs8Ek/4BtjSAWnNUa+bF4PUvQa7LbyXUmnMimOyP0GdONE/3uQr8Ar/BsgZQmV6kORkuR4DmmOj2BlCfOWmjIS+C7W4wgNreNfZKogeDScruBtCQOUuAw8o290O54ZVED4SY451J5bdZlfjC8AzY5nGYH1SZoZVE94KYc6gB1GdOkp8XHgbb+GS9CKi+dmOnDIWd4U8w0WMNIE0YNURijr/dDbZ5GZYGVc6crcE7j4meagANmaNuBtu8BSsYQGXMSSKbwndgoucYQBoznTm2vQVs8yGsBqpvIh87JRFrqO/BRC810Gmo56Rg/RzWMYDKmbMZxJyrDXRqjYja2DVgG8uOTQygcuasD1+Bid5ooNMoc9redBnEnM0NoHLmrA4fgYnmaVf1mRODzgfb/ARbGUDlzFkZ3gETvcNApyFzUrC67ryTAVTGnNytVoTXwUQfhBSXfeYkHnNkTwOonDnLw2tgkk/CgqBGPbO05pwEMecAA2hUm7FUErGITIX9AiwGqi/RxFPNy+EGUDlz3Lt6CkzyOVgG1JA59paYs78BVMacDA+LyIfAJN2aWRRUX6KZV9qCte05mbDHWjHHZO4Ek3wVhorImOMdKrsTxxtA5cxRPvyZ5Nvg3UsNmeOzjYvttjvdAPL/LGfOVWCSPgymiBwyZ2NIwXquAaQxJcxpk7gETPJLWNcA6ntmSdxi0+ttd56BTmXMSSIuVZjkF7CBATRkjj3M5QrbaW7U9sixlcYkERe5TNJh4nBRfeZkuDk3OUfZzmEZlTPnBDBJVwSHisjWHFcBbXeTgU5lzEmix4FJemseKiLTxlu+t37b+SiQIVrCHJVEDwOTFB/u1JA57jjkPI8PkT5MqjLmxID9IOYMFZGJeyrsCbCN5Yd7Waqv3dgp5ni0JOZYUKohc/x0t9M2Fq4WsKqcOTuAe+Um6lKEcnhkHmmV5O05d4FtXA9y6UOVM8c9cpc7TdRFLNVnTuYUF8UeANu8C568UH1z1dgpiXiHcrnTRD3MpDRmOnOUy6q2sexY0wAqZ47PNuk5HoOLhsxxQd42H0PZvauN4Fsw0SsMdGqNiNrYlWAbt3bc4lHlzFkb3Lk0UTfrolHmtL0pR+DcFCy7d7UGfAAm6jZvNGTOhWAby45tDaBy5lhhx5x7Iab0mRODUs1bduxqAJUxJ88kHiFJEfkYzAdq1DOLxsS0VPOas7cBVOY5J0m2RaTmTHdSqzXnGLCNh592MYDKmJPhsTi4LWOij8B0PUclfgjYRlKwljFHJZlMri5guZelhsxpj/578FKVMie9xzdmfP/BRN1V2BHUqGQz6e4GeQ3ySAOolDkqCeXY7Xvd5yeQfaz2zhVztoMUrCcbQF4Xw0uoTeZpMFmLUU96+f02ULku5vj6o68FeM1pBpDXlDJHpWd4hM1k35j5r6nJ2nexjB1lAGXCdqfia/C3VPMlzVExKDVThopyDjLmMMorRRabDj3jQ9X82CvmeNLCs35W6p78UjnUdBZohsf77WXpVZ4RjEqaozI5Z0eirdKViS8Jvmrt79kvvw6idvIeW436CxszWeVLH96RzgCHz3rgil9w3ThG3A77TH2dGfMWX1ZJ2h6hWaP4Fbzta+JFUO7tGdU3R6QXWZh6WGA58OSpy6LifOOn6zkaFZXvOa36zBsljfkv14+NhpLK7/YmTZAMMTXr52yrkr1joon+b82Y8Q+EaFIIkNfwGgAAAABJRU5ErkJggg==", offset: [-6] },
    write: { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHfSURBVHhe7Zs7SgRBFEXHH4IfxC0YiXsRAwUxcQUauRc1EJNBEAzNXIeRRi5BBfGDn3ubejA0M1wcZx5MeQ9cii6qu7pPve6oq2OMMcYY80+ZKm0W0yXD8lVSJaNajNRFzZqMVcOV30S2kOfS10tUV78q4fEScoNcITGuGmZLe4p8/yGXCInrjZ2sCuI8fMB1ZAN5K31kBnlEtpED5BzpIivIJ0J47jxyh9wicb2qUIuxj/ChD5ujwWQtakP7OzBO+PCcjxXTG1YGWSztQmnZ3x7L81MrJ1MQ4YeVr007JD660fYbl/5hzhY0cViQwIIEFiSwIIEFCSxIYEECCxJYkMCCBBYksCCBBQksSGBBAgsSWJDAggQWJLAggQUJLEhgQQILEliQwIIEFiSwIIEFCSxIYEECCxJYkMCCBBYksCCBBQksSGBBgmxB3EbQ7+95Em1sNeDxoLFpZE4YG1Daf8+/I+SltK+lZX97LP+0T92rkTVZyFkr+Sh9hIvE3T57yBFygpwhqwilEJ47hzwg90hcrxpif9cxwgcbNhcIqW6/GKuEr8cOsos8lb5eeC/so4j2phUeLyPXCPeSxfWqYlSLkbWoDamTAa58VMlv4b2yaqqrHGOMMcYYM3F0Oj/n1Gmes0hRGwAAAABJRU5ErkJggg==", offset: [-6] },
    move: { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUUSURBVHhe7Zs5qCxFGIXHDUEUXCKVJ4KCgYIGCiYmJmr6sqdGijuYiabGIi6BgSuK+gRBI1HB1EQ0cMlURHDHFZfA7b3z9e1z+V+/mjt3uvsvZqbnwKGn63bX8k11T1X9dWdb7a2T2uOq6MT2uFVHJ7RHq3s+abnXcDwkn9qcbXtTowjhcfmI/ExztqNJQyrB+bc9Th5SbPRjMlAiIPy0bE0KUmzsozIwPpWfbT+/KH/Ufn5KtiYBqQTnV/ki+cb2/E75XPn79nwykEpwfpKvJkG6WybtgeZsNrtC/lqeBKR5cK4kodUdMun3NWc7ukzeeEglOD/KhuNxTxeQ0y+VNxZSHBGXes7JrVEXUPzbRkKKcB6RS3DisQQoHiOkJ0lotbbTElf8CZlGxcfKjUaLACF/ju+k50lolQapRhf9U/5FvkF+X6axDAiXEddz3yfydfIP8l+yBbC1U/xWz2uPpS9kPz3I8v2Mk5x/6iOW2YNorCv/jUxZ/zdn/cX95POt7PxTe08mIOTK05ChcCzyIb90OCgbkDV2Q8gvHQ6qBWhttQW0QH0B+R1gr6oG17EPIArzO8BeVUiD67gsIK6nMMQI+aGdj7tpq6YHZRbiEHVMfaXEzD23+ln2ILBvL1pmoLgfuR7nyF/J5BnnbimQYqZxyeIqEqQhhY4NCLk+zN0MKW0VoAQnzsqHFpYBCEVIaUsli+AMbQTKAoScRwqkEpx5SxZDlAkIOZ9RF91q9BwrGxAaFVJNOKgGIDQKpHiRI57ErRyaYSGdgsa0F+fvkinv/uZs/LLY6uOyLpcdd9t3BDeOYxwrJ+JJUK+GbpYp857mLF+M3z6WKTPuBThmPNcd3EGQQeC9zdls9pz8jnym/B8JCaLM3+Xr5Zvk1+TX5TPksdaQuqI38WRcIxPJRUCiF/8jwwVwu3LXcviXNeC4kaCW/y6kZZsv3uXeLqPdnXfuQSbGM8oc6xYZsZHgXTm7B/0hXysflN+Q35RPlzN70G8yPzxu6yvyrTLBgON6EIqPG92NC9hlwQJ5DdV+B50lvydTJnCsyOE4xbc4b3du5m3PWx+t868YdlmXyF/KlHeYhFax/XMVL2KcQCaMGxg/IAoaU86v1jiIX+XPZcp6iYRW+4Jj1YRUA1AJzssktFoKjlULUjagFDhWDUiZgFLhWIsgDS0kC5DrdbGcBscqQWKlbgxIGYBcH3rOZ3IqHKsE6TvZ46Q9xw97aGxArsfZ8hcyeY7ya7VI3jiAbpNfkJkzAWmVBBBEQIF53asyczxE/bNG57sqQe3be1DGI1aqz1I9x+pzk3dXWHz2t7Yqoj7Uy/Xk2Kvn9KIquQJo1eBY1Mv17F3HvoDQqoLpalA9hwCahGoB8uM4lsbOb65qAaKbj1UW+fixSQdVCxAbCeI4qq+4n3wYBCJApULKBOSKswXlQ5nwL43rO77hPu5n+vCB/LCcrho96AL5fPktGUjeFL6MuJ77mHi+LV8oH5BRei/KUqw0+3NoSGmpxMd5I2kf45JFnFutJRwrVn7eepJDLCVAJTjps/Laio0oQfJCeheQ0zcajrUIEuoCQpOAY82D5JBS939WCc1MBo5VgsR6EhsJHPYmPkZQz3GrycCxSpDYZeF/vCOq64hn75XAdVdsrCO4mPi/Py8d8dw0xUZ7L4B3WcRY+SThWKWeNPme05UhnCKzP+e05mwL5xh1pwtrPX3IElCYdmzhbLUxms2OAv7Gq2wMaxf2AAAAAElFTkSuQmCC", offset: [-7] },
    fill: { base64: "data:image/png;base64,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", offset: [-8] },
    zoom: { base64: "data:image/png;base64,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", offset: [-8] },
    // camera: { base64: "data:image/png;base64,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", offset: [] },
    protect: { base64: "data:image/png;base64,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", offset: [-8] },
    eraser: { base64: "data:image/png;base64,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", offset: [-8] },
    // copy: { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARcSURBVHhe7ZtLrw1ZGIaPRrtfI8QfMGFoJJG0mQQDRE/5CSIi0omBnhj4BwYkhnS3SzAUAwwwE1oYEDGQuEYPutEu77OzP0pZu76qfVbtXef43uRJXfZaX61617dW1T5n7YlQKBQKdVcz+tsmos5P/e249El87G87pXGakhId1aqa3DBl6bEFYrNYKT6IUZrG9WeKp+KCeN8/ph1jlZmwUFwVNHTcXBbLBMKkVlS3962X9oujgsadF3MEjR2VaC9Zs01sEtfFFvFajDWTrIdOCgz5pXc0PtGePwRtuSaWCtRaJnmyC58QRYN+FrP622GYLaifgs9SdeYKxATdGZMGGZSjMalhXnfot25S0zkIg/YIxv8VQQNp3DrB0413kzoxqUPMV+KeoA7nkO0vF2sEMZGdJ7ueiMcC0YbTYocY25xkPVLOIBpNAx8IzjflhkDFHrf93SJVB44LxDBErWVSnd5G1huDMuiIWCv+65/zRFbMFxh0WFDHMsX2N4oD4q1AtJU2LBJnxLH+Ocpznu0psVNg0lYxskyynujSHFQsY53CNmsmWeDJijg0ognMJWy5mbI4hwFWplyvaAgi49hn+6v4U2wQFwUmkUHUbU0WvI0MyilrD2ZZJvHmP3Qm1UllRODUHGTnEe8nfBVJZURKXPudeNM7+l688ywWVfGIQX3imKxNmGRzUvHpZpmWVeZ8KoPss73if/FcvHSgDF8ZzgpkMZANm+3iX/FCDIqBEdw4Ksaw/WImMSctEahuYnxpTA7Ri7zXAD3lwU3+I1AqS7j5qlh8Roxi9pgsg2xO4qnHnLRPoJz33ZP1SNUcxDvJPMFQqwNlGUaDxGTsxePzYhvKIgZaL2g3RqGqOt8op5MMGYYE70J1oGyq900MVy8en9scmFJ5rmk89+Q0iHFNzxCzDqmy5bmB4yLl8oOuV44ztAiWS6QwvUkv1SFVtjwXcVykXH7Q9cpxTI2Nq1uBnqIxVY95vgLYS9kwPUgdvlY86x19L+arFcKLXYxDAmAYc9BNwRzEl9piu7OIgKjqMX9Q8BnzChdvAvMXdW8L/kqJzAjLcp5ClOOGmZ/qxkE2Sf/VO/raZlc5hxg99kjcHZL74qHgRlJiQv5b3BGp+oYXpxVVZVCXZQnQiQyalsptEPPGZKlSqvwgsii3QaTxZKlSqvwgsiiGmKMwyFEY5CgMchQGOQqDHIVBjsIgR2GQozDIURjkKAxyFAY5CoMchUGOwiBHYZCjMMhRGOQoDHIUBjkKgxyFQY7CIEdhkKMfzaDG/3GdrEGskmChZJdBQ/+vvqlBVp4FTIjFUux3FVskyj4yw2qrrrNkCiu4DonfxSXBWhuW/mZbKNCCuD+W4/HLH5be8auk34TdTzaZkavELVFcRTFVYPUZ7Ue1h1yTsUlZLsTvvHaJ1YLUbRJj1KK9ZAs/WzjX39p9tKIum1FHjds/zA1Th8l6KplFxlStnw6FQqFQaNppYuIz7UDsihVWZboAAAAASUVORK5CYII=", offset: [] },
    paste: { base64: "data:image/png;base64,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", offset: [-8] },
}

export const tools = {};

export const toolIDs = Object.keys(cursors).reduce((acc, toolName, index) => (acc[toolName] = index, acc), {});
export function getCursorOffsetByBase64(base64) {
    const cursorEntries = Object.entries(cursors);

    for (const [_, cursorData] of cursorEntries)
        if (cursorData.base64 === base64)
            return cursorData.offset;
    
    return null;
}
export const getToolById = id => {
    const toolName = Object.values(tools)[id].elementName;
    return tools[toolName];
}

const canvas = document.getElementById("gameCanvas");

class Tool {
    constructor(name, cursor, fxRenderer, minRank, onInit) {
        this.name = name;
        this.elementName = name.toLowerCase().replaceAll(" ", "-");
        this.cursor = cursor;
        this.minRank = minRank.id;
        this.fxRenderer = { type: fxRenderer[0], params: fxRenderer.slice(1) };
        this.eventListeners = [];
        this.onInit = onInit;
        this.id = Object.keys(tools).length;
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
    show() {
        const toolButton = document.getElementById(`tool-${this.elementName}`);
        if (toolButton) toolButton.style.display = '';
    }
    hide() {
        const toolButton = document.getElementById(`tool-${this.elementName}`);
        if (toolButton) toolButton.style.display = 'none';
    }
}

function removeSelectedClass() {
    const buttons = document.querySelectorAll(".selected-tool");

    buttons.forEach(element => {
        element.classList.remove("selected-tool");
    });
}

function addTool(tool) {
    tool.addEvents();

    const toolButton = document.createElement("button");
    toolButton.id = `tool-${tool.elementName}`;
    toolButton.className = "tool-item";
    const toolImageDiv = document.createElement("div");
    toolImageDiv.style.backgroundImage = `url("${tool.cursor.base64}")`;

    toolImageDiv.style.margin = tool.cursor.offset.join("px ") + "px";

    toolButton.appendChild(toolImageDiv);
    document.getElementById("tools-window").appendChild(toolButton);

    document.getElementById("tool-" + tool.elementName).addEventListener("click", () => {
        const currentTool = getToolById(local_player.tool);
        // this shit needs to be rewritten, so tools and cursors will be independent
        if (tool.id !== currentTool.id) {
            currentTool.deactivate();
        }
        local_player.tool = toolIDs[tool.elementName];
        tool.activate();
        removeSelectedClass();
        document.getElementById("tool-" + tool.elementName).classList.add("selected-tool");

        events.emit("setTool", local_player.tool);
    });

    tools[tool.elementName] = tool;

    document.getElementById("tools-window").style.top = `calc(50% - ${document.getElementById("tools-window").clientHeight}px / 2)`;

    if (Object.keys(tools).length === 1) document.getElementById("tool-" + tool.elementName).click();
}

events.on("newRank", (newRank) => {
    Object.values(tools).forEach(tool => {
        if (newRank >= tool.minRank) {
            tool.show();
        } else {
            tool.hide();
        }
    });
});

{
    addTool(new Tool("Cursor", cursors.cursor, [Fx.RECT_SELECT_ALIGNED, 1], ranks.User, function (tool) {
        function mouseDown(event) {
            if (event.buttons === 1 || event.buttons == 2) {
                const color = event.buttons === 1 ? local_player.selectedColor : [255, 255, 255];
                world.setPixel(mouse.tileX, mouse.tileY, color);
            }
        }
        
        tool.setEvent('mousemove', mouseDown);
        tool.setEvent('mousedown', mouseDown);
    }));

    addTool(new Tool("Pipette", cursors.pipette, [Fx.NONE], ranks.User, function (tool) {
        async function mouseDown(event) {
            if (event.buttons === 1) {
                const color = await world.getPixel(mouse.tileX, mouse.tileY);

                const colorExists = local_player.palette.some(existingColor => 
                    existingColor[0] === color[0] && existingColor[1] === color[1] && existingColor[2] === color[2]
                );

                if(!colorExists) addColor(color);
                local_player.selectedColor = color;

                setTimeout(() => {
                    const colorElement = document.querySelector(`.color-item[data-color='${color.join(",")}']`);
                    if (colorElement) {
                        colorElement.click();
                    }
                }, 0);
            }
        }

        tool.setEvent('mousemove', mouseDown);
        tool.setEvent('mousedown', mouseDown);
    }));

    addTool(new Tool("Pencil", cursors.pencil, [Fx.NONE], ranks.User, function (tool) {
        let intervalId = null;
        let drawingStarted = false;

        tool.setEvent('mousemove', event => {
            if (event.buttons === 1) {
                if (!drawingStarted) {
                    drawingStarted = true;
                    mouse.prevLineX = mouse.tileX;
                    mouse.prevLineY = mouse.tileY;
                }

                if (intervalId === null) {
                    intervalId = setInterval(() => {
                        const prevPos = [mouse.prevLineX, mouse.prevLineY];
                        const currPos = [mouse.tileX, mouse.tileY];
                        if (!prevPos[0] || !prevPos[1]) {
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
    }));

    addTool(new Tool("Write", cursors.write, [Fx.NONE], ranks.User, function (tool) {
        tool.setEvent('keydown', event => {
            if (event.key === 'Enter' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
                events.emit("addText", local_player.text, mouse.tileX, mouse.tileY);
                local_player.text = '';
            } else if (event.key === 'Backspace') {
                local_player.text = local_player.text.slice(0, -1);
            }
        });
    }));

    addTool(new Tool("Move", cursors.move, [Fx.NONE], ranks.User, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 1) {
                camera.x -= event.movementX;
                camera.y -= event.movementY;
            }
        });
    }));

    addTool(new Tool("Fill", cursors.fill, [Fx.NONE], ranks.User, function (tool) {
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

    addTool(new Tool("Zoom", cursors.zoom, [Fx.NONE], ranks.User, function (tool) {
        tool.setEvent('mousedown', event => {
            if (event.buttons === 1) {
                camera.editZoom(0.5);
            } else if (event.buttons === 2) {
                camera.editZoom(-0.5);
            }
        });
    }));

    addTool(new Tool("Protect", cursors.protect, [Fx.NONE], ranks.Moderator, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 0 || event.buttons === 4) return;
            const chunkX = Math.floor(mouse.tileX / 16);
            const chunkY = Math.floor(mouse.tileY / 16);

            world.setProtection(event.buttons === 1, chunkX, chunkY);
        });
    }));

    addTool(new Tool("Eraser", cursors.eraser, [Fx.RECT_SELECT_ALIGNED, 16], ranks.Moderator, function (tool) {
        tool.setEvent('mousemove', event => {
            if (event.buttons === 4 || event.buttons === 0) return;
            const chunkX = Math.floor(mouse.tileX / 16);
            const chunkY = Math.floor(mouse.tileY / 16);

            world.setChunk(event.buttons === 1 ? local_player.selectedColor : [255, 255, 255], chunkX, chunkY);
        });
    }));

    addTool(new Tool("Paste", cursors.paste, [Fx.NONE], ranks.Moderator, function (tool) {
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
                                const [chunkOffsetX, chunkOffsetY] = chunkKey.split(',').map(Number);
                                const baseChunkX = Math.floor(mouse.tileX / 16);
                                const baseChunkY = Math.floor(mouse.tileY / 16);
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
    }));
}

export default {
    tools,
    Tool,
    addTool,
    cursors
}