# DrawZone Client Documentation

The `DrawZone` object is a central part of the DrawZone client-side application, encapsulating various modules and functionalities related to the game. It is defined and exported in `client-src/bundle.js`.

## Structure

The `DrawZone` object is structured as follows:

- `chunks`: An object to store chunk data.
- `chat`: The chat module imported from `./network/chat.js`.
- `network`: Contains the Socket.IO client instance for real-time communication.
- `camera`: Manages the camera's position and zoom level in the game world.
- `renderer`: Handles rendering of the game world, including effects, players, and UI elements.
- `world`: Contains methods and properties related to the game world, such as chunk and line management.
- `mouse`: Manages mouse state and interactions.
- `player`: Represents the local player, including their state and actions they can perform.
- `events`: An event emitter for managing custom events within the application.
- `players`: Manages the state of other players in the game.
- `tools`: Contains tools that players can use to interact with the game world.
- `windowSystem`: Manages GUI windows within the application.
- `ranks`: Contains player rank information imported from `./shared/ranks.json`.

### [DrawZone.chat](../client-src/network/chat.js)
## [DrawZone.chat.send(string message)](../client-src/network/chat.js)
Send a message to the server chat through the WebSocket connection.
## [DrawZone.chat.local(string message)](../client-src/network/chat.js)
Send a local message to the chat without broadcasting it to everyone.

### [DrawZone.camera](../client-src/camera.js)
```json
{
    "x": 0,
    "y": 0,
    "zoom": 16,
    "minZoom": 4,
    "maxZoom": 16,
    "zoomStrength": 1
}
```

### [DrawZone.camera.x](../client-src/camera.js#L9)
X offset of the camera
### [DrawZone.camera.y](../client-src/camera.js#L10)
Y offset of the camera
### [DrawZone.camera.zoom](../client-src/camera.js#L11)
Zoom offset of the camera. Basically the size of a game pixel.
### [DrawZone.camera.minZoom - DrawZone.camera.maxZoom](../client-src/camera.js#L12)
Zoom range limit
### [DrawZone.camera.zoomStrength](../client-src/camera.js#L14)
Increacement of zoom per mouse wheel scroll or Zoom tool.
### [DrawZone.camera.editZoom(float change)](../client-src/camera.js#L15)
Teleport camera to specific position

### [DrawZone.renderer](../client-src/renderer.js#L316)
### [DrawZone.renderer.Fx](../client-src/fx.js)
Tool and other player FX.
### [DrawZone.renderer.options](../client-src/renderer.js#L9)
Rendering settings
### [DrawZone.renderer.renderAllChunks()](../client-src/renderer.js#L160)
Render every visible chunk
### [DrawZone.renderer.renderChunk(array chunkData, int chunkX, int chunkY)](../client-src/renderer.js#L132)
Render specific chunk
### [DrawZone.renderer.renderText(string text, float x, float y)](../client-src/renderer.js#L123)
Save and render a text at specific position
### [DrawZone.renderer.requestRender()](../client-src/renderer.js#L251)
DrawZone does re-render only when there are any updates, the function is to update current state.

### [DrawZone.world](../client-src/world.js#L20)
### [DrawZone.world.canDraw(int x, int y)](../client-src/world.js#L9)
Check if you can draw at specific position by ensuring quota, protection and chunk loaded.
### [DrawZone.world.drawLine(array[2] from, array[2] to)](../client-src/world.js#L45)
Draw a line from position A to position B
### [async DrawZone.world.getPixel(int x, int y)](../client-src/world.js#L63)
Return the specified pixel color
### [DrawZone.world.setPixel(int x, int y, array[3] color)](../client-src/world.js#L25)
Set pixel at specific position with specified color.
### [DrawZone.world.name](../client-src/world.js)
World you're currently in
### [DrawZone.world.setChunk(array[3] color, int chunkX, int chunkY)](../client-src/world.js#L96)
Set chunk RGB
### [DrawZone.world.setChunkData(array[16] chunkData, chunkX, chunkY)](../client-src/world.js#L107)
set chunk data
### [DrawZone.world.chunks](../client-src/bundle.js#L28)
Object containing the chunk data
### [DrawZone.world.lines](../client-src/bundle.js#L29)
Object containing the chunk data
### [DrawZone.world.texts](../client-src/bundle.js#L30)
The text written in the world by players
### [DrawZone.world.setProtection(bool value, int chunkX, int chunkY)](../client-src/world.js#L91)
Set chunk protection to specified boolean value

### [DrawZone.mouse](../client-src/mouse.js#L6)
```json
{
    "x": 962,
    "y": 1,
    "mouseX": 579,
    "mouseY": -308,
    "prevTileX": -23.9375,
    "prevTileY": -18,
    "tileX": 36.1875,
    "tileY": -19.25,
    "prevLineX": null,
    "prevLineY": null,
    "lineX": null,
    "lineY": null,
    "buttons": 0
}
```

### [DrawZone.player](../client-src/local_player.js#L46)
### [DrawZone.player.currentFxRenderer](../client-src/local_player.js#L68)
Player fx used, see client-src/fx.js
### [DrawZone.player.id](../client-src/local_player.js#L59)
Player ID
### [DrawZone.player.lineQuota](../client-src/local_player.js#L56)
Rate-limiter for the line drawing
### [DrawZone.player.pixelQuota](../client-src/local_player.js#L57)
Rate-limiter for the pixel drawing
### [DrawZone.player.nickname](../client-src/local_player.js#L54)
Saved nickname set with /nick
### [DrawZone.player.palette](../client-src/local_player.js#L48)
List of colors in player's palette
### [DrawZone.player.selectedColor](../client-src/local_player.js#L47)
Array[3] containing your color
### [DrawZone.player.rank](../client-src/local_player.js#L55)
Rank ID
### [DrawZone.player.text](../client-src/local_player.js#L60)
The text written to buffer

### DrawZone.events
`loadChunks`: Request the network to load chunks\
`addText`: Add and send text in the buffer\
`setTool`: Request the network to change tool\
`newRank rankID`: Got new rank\
`playerJoined id`: Player joined\
`playerLeft id`: Player left\
`playerUpdate id, tool, color[3]`: Player data updated\
`playerMoved id, x, y`: Player moved

### [DrawZone.players](../client-src/sharedState.js#L4)
```json
{
    "2": {
        "x": 0,
        "y": 0,
        "color": [ 0, 0, 0 ],
        "tool": 0
    }
}
```

### DrawZone.tools
### [DrawZone.tools.Tool](../client-src/tools.js#L46)
The base tool class
### [DrawZone.tools.addTool](../client-src/tools.js#L100)
Init the Tool class to the client
### [DrawZone.tools.cursors](../client-src/tools.js#L13)
Object containing tool icons and icon offsets
### [DrawZone.tools.tools](../client-src/tools.js#L30)
Object containing player tools

### [DrawZone.windowSystem](../client-src/windowSystem.js#L182)
### [DrawZone.windowSystem.GUIWindow](../client-src/windowSystem.js#L43)
Class representing the base window.
#### Example usage:
```js
new GUIWindow('My Window Title', {}, (windowInstance) => {
    const content = document.createElement('p');
    content.textContent = 'This is a dynamic content inside the window.';

    windowInstance.addObj(content);
}).move(200, 200);
```
### [DrawZone.windowSystem.windows](../client-src/windowSystem.js#L5)
Object containing all windows

### [DrawZone.ranks](../client-src/shared/ranks.json)
See client-src/ranks.json