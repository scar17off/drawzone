## Server Documentation

### Global Server Variables

The server maintains several global variables that are crucial for its operation. These variables include:

- **worlds**: An array that stores instances of all the worlds available on the server.
- **plugins**: An array that holds instances of all the plugins loaded into the server.
- **config**: An object that contains the server configuration settings loaded from a JSON file. This includes settings like port numbers, feature toggles, etc.
- **env**: An object that stores environment variables accessible throughout the server.
- **events**: An `EventEmitter` instance used to handle and emit custom server events.

### Server Events

The server uses an event-driven architecture to manage interactions and state changes. Here are some of the key events:

- **playerJoin**: Emitted when a player joins the server. It passes the `Client` instance of the joining player.
- **playerLeft**: Emitted when a player disconnects from the server. It also passes the `Client` instance of the departing player.
- **message**: Emitted when a message is sent in the server. It passes the message, the `Client` instance sending the message, and the rank of the sender.
- **playerUpdate**: Emitted when a player's state is updated (e.g., changing tools, colors).
- **newPixel**: Emitted when a new pixel is placed in the world. It passes the `Client` instance of the player who placed the pixel, and the coordinates of the pixel.

These events help in managing the state and interactions of players within the server environment efficiently.