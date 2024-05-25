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

1. Clone the repository to your machine.
2. Install the dependencies by running `npm install`.
3. Build the client using `npm run build`.
4. Start the server using `npm start`.

## Configuration

The game's configuration can be found in `config.json`

# TODO:
- [ ] Line art drawing
  - [ ] Add feature to request and load lines in chunks
- [ ] ASCII art drawing
  - [ ] Add feature to request and load texts in chunks
- [ ] Tools
  - [ ] Copy
  - [x] Screenshot
- [ ] Tempmute & Tempban
  - bansManager.js, muteManager.js
- [ ] Add Customizable World Templates
- [ ] Optimize network
  - Make the network do flush updates so placing 999 pixels at once will send less update messages instead of 999.