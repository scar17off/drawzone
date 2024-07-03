# DrawZone

DrawZone is a hybrid game inspired by OWOP, OWOT, and Cursors.io. It allows players to interact in a shared world where they can draw pixel arts, line arts and ascii arts and communicate in real-time.

## Features

- Real-time multiplayer drawing experience.
- Chunk-based world system to manage different areas of the game world.
- Player ranks and permissions.
- Customizable world templates.
- WebSocket communication using Socket.IO for real-time updates.
- Client-side camera controls for navigation.

## Getting Started

To get started with DrawZone, follow these steps:

1. Clone the repository by running `git clone https://github.com/scar17off/drawzone`.
2. Install the dependencies by running `npm install`.
3. Build the client using `npm run build`.
4. Create a .env file template by running:
```bash
echo adminlogin= > .env && echo DISCORD_BOT_TOKEN= >> .env
```
5. Start the server using `npm start`.

## Configuration

The game's configuration can be found in `config.json`

# TODO:
- [ ] Line art drawing
  - [ ] Add feature to request and load lines in chunks
- [ ] ASCII art drawing
  - [ ] Add feature to request and load texts in chunks
- [ ] Tools
  - [ ] Copy
- [ ] Tempmute & Tempban
  - bansManager.js, muteManager.js

## Documentation
- [Server](docs/server.md)
- [Plugins](docs/plugins.md)
- [Client](docs/client.md)
- [Commands](docs/commands.md)