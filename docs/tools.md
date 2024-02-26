## Constructor parameters
- name - The name of the tool.
- cursor - The cursor object associated with the tool.
- effects - An array of effects the tool can apply.
- rank - The minimum rank required to use the tool.
- action - The function to be executed when the tool is used.

### Tool.setEvent
Save a tool event to the canvas and deactivate on unequip.

## Example circle tool
DrawZone.tools.addTool(new DrawZone.tools.Tool("Circle", DrawZone.tools.cursors.cursor, [DrawZone.renderer.Fx.NONE], DrawZone.ranks.User, function (tool) {
    const segmentCount = 15;
    let startPoint = null;

    tool.setEvent("mousedown", event => {
        if (event.buttons === 1) {
            startPoint = [DrawZone.mouse.tileX, DrawZone.mouse.tileY];
        }
    });

    tool.setEvent("mouseup", () => {
        if (startPoint) {
            const endPoint = [DrawZone.mouse.tileX, DrawZone.mouse.tileY];
            const radius = Math.sqrt(Math.pow(endPoint[0] - startPoint[0], 2) + Math.pow(endPoint[1] - startPoint[1], 2));
            const angleIncrement = 360 / segmentCount;
            const points = [];
            for (let angle = 0; angle < 360; angle += angleIncrement) {
                const x = startPoint[0] + radius * Math.cos(angle * Math.PI / 180);
                const y = startPoint[1] + radius * Math.sin(angle * Math.PI / 180);
                points.push([x, y]);
            }
            for (let i = 0; i < points.length - 1; i++) {
                DrawZone.world.drawLine(points[i], points[i + 1]);
            }
            DrawZone.world.drawLine(points[points.length - 1], points[0]);
            startPoint = null;
        }
    });
}));