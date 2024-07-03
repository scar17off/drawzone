## Commands

### /nick <nickname>
Set your nickname. If no nickname is provided, it resets the nickname.

### /tp <player|coordinates>
Teleport to a player by ID or to specific coordinates. Usage:
- /tp <playerID>
- /tp <x> <y>
- /tp <playerID> <destinationPlayerID>
- /tp <playerID> <x> <y>

### /kick <player>
Kick a player by their ID.

### /kickip <IP|ID>
Kick a player by their IP address or ID.

### /setrank <player> <rank>
Set the rank of a player.

### /list
List all players by rank.

### /spawn
Teleport to the spawn point.

### /tell <player> <message>
Send a private message to a player.

### /world set <property> <value>
Set a property of the world. Supported properties:
- background: Use format `255,255,255`
- lineQuota: Use format `ratexper`
- pixelQuota: Use format `ratexper`

### /join <player> <world>
Move a player to a specified world or join a world.

### /help <page>
Display a list of commands. Usage:
- /help
- /help <page>