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

## Key Components

### Network Communication

The `network` property holds the Socket.IO client instance, facilitating real-time communication with the server.

### Structure

javascript:client-src/bundle.js
```js
    network: {
        io: socket
    },
```
- `io`: This is the Socket.IO client instance used for real-time communication between the client and the server.

### Chat

## DrawZone.chat.send
Send a message to the server chat through the WebSocket connection.
## DrawZone.chat.local
Send a local message to the chat without broadcasting it to everyone.

### DrawZone.camera
```json
{
    x: 0,
    y: 0,
    zoom: 16,
    minZoom: 4,
    maxZoom: 16,
    zoomStrength: 1,
    editZoom,
    centerAt
}
```

### DrawZone.camera.x
X offset of the camera
### DrawZone.camera.y
Y offset of the camera
### DrawZone.camera.zoom
Zoom offset of the camera. Basically the size of a game pixel.
### DrawZone.camera.minZoom - DrawZone.camera.maxZoom
Zoom range limit
### DrawZone.camera.zoomStrength
Increacement of zoom per mouse wheel scroll or Zoom tool.
### DrawZone.camera.editZoom(float change)
Edit the zoom ensuring the minZoom and maxZoom
### DrawZone.camera.centerAt(int x, int y)
Teleport camera to specific position

### DrawZone.renderer
### DrawZone.renderer.Fx
Tool and other player FX.
### DrawZone.renderer.chunks
Object containing the chunk data
### DrawZone.renderer.options
Rendering settings
### DrawZone.renderer.renderAllChunks()
Render every visible chunk
### DrawZone.renderer.renderChunk(array chunkData, int chunkX, int chunkY)
Render specific chunk
### DrawZone.renderer.renderText(string text, float x, float y)
Save and render a text at specific position
### DrawZone.renderer.requestRender()
DrawZone does re-render only when there are any updates, the function is to update current state.

### DrawZone.world
### DrawZone.world.canDraw(int x, int y)
Check if you can draw at specific position by ensuring quota, protection and chunk loaded.
### DrawZone.world.chunks
Object containing the chunk data
### DrawZone.world.drawLine(array[2] from, array[2] to)
Draw a line from position A to position B
### async DrawZone.world.getPixel(int x, int y)
Return the specified pixel color
### DrawZone.world.setPixel(int x, int y, array[3] color)
Set pixel at specific position with specified color.
### DrawZone.world.name
World you're currently in
### DrawZone.world.setChunk(array[3] color, int chunkX, int chunkY)
Set chunk RGB
### DrawZone.world.setChunkData(array[16] chunkData, chunkX, chunkY)
set chunk data
### DrawZone.world.texts
The text written in the world by players
### DrawZone.world.setProtection(bool value, int chunkX, int chunkY)
Set chunk protection to specified boolean value

### DrawZone.mouse
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

### DrawZone.player
### DrawZone.player.currentFxRenderer
Player fx used, see client-src/fx.js
### DrawZone.player.id
Player ID
### DrawZone.player.lineQuota
Rate-limiter for the line drawing
### DrawZone.player.pixelQuota
Rate-limiter for the pixel drawing
### DrawZone.player.nickname
Saved nickname set with /nick
### DrawZone.player.palette
List of colors in player's palette
### DrawZone.player.selectedColor
Array[3] containing your color
### DrawZone.player.rank
Rank ID
### DrawZone.text
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

### DrawZone.players
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
### DrawZone.tools.Tool
The base tool class
### DrawZone.tools.addTool
Init the Tool class to the client
### DrawZone.tools.cursors
Object containing tool icons and icon offsets
### DrawZone.tools.tools
Object containing player tools

### DrawZone.windowSystem
### DrawZone.windowSystem.GUIWindow
Class representing the base window
### DrawZone.windowSystem.windows
Object containing all windows

### DrawZone.ranks
See client-src/ranks.json