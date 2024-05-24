import events from "./events";

const TS = 76;
export const cursors = {
    cursor: { x: 0, y: 0, offset: [-8] },
    pipette: { x: TS*3, y: TS*2, offset: [-8] },
    pencil: { x: 0, y: TS*2, offset: [-8] },
    line: { x: TS, y: 0, offset: [-8] },
    move: { x: TS, y: TS, offset: [-8] },
    fill: { x: TS, y: TS*2, offset: [-8] },
    zoom: { x: TS*2, y: 0, offset: [-8] },
    protect: { x: TS*2, y: TS, offset: [-8] },
    eraser: { x: TS*2, y: TS*2, offset: [-8] },
    paste: { x: TS*3, y: 0, offset: [-8] },
    areaerase: { x: TS*3, y: TS*2, offset: [-8] },
    areaprotect: { x: TS*4, y: 0, offset: [-8] },
    camera: { x: TS*4, y: TS, offset: [] },
    copy: { x: TS*3, y: TS, offset: [-8] }
}

export function loadAndParseTools() {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const promises = Object.keys(cursors).map(toolKey => {
            return new Promise(resolve => {
                const tool = cursors[toolKey];
                const toolSize = 76;

                const toolCanvas = document.createElement('canvas');
                toolCanvas.width = toolSize;
                toolCanvas.height = toolSize;
                const toolCtx = toolCanvas.getContext('2d');

                toolCtx.drawImage(canvas, tool.x, tool.y, toolSize, toolSize, 0, 0, toolSize, toolSize);
                tool.base64 = toolCanvas.toDataURL();
                resolve();
            });
        });

        Promise.all(promises).then(() => {
            events.emit("toolCtxLoaded", cursors);
        });
    }
    img.src = "/img/toolset.png";
}