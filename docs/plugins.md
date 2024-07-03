## Creating Plugins for DrawZone

DrawZone supports the creation of plugins to extend its functionality. This guide will walk you through the process of creating and integrating plugins into the DrawZone environment.

### Step 1: Setting Up Your Development Environment

1. Ensure you have Node.js and npm installed on your system.
2. Clone the DrawZone repository:
   ```bash
   git clone https://github.com/scar17off/drawzone
   ```
3. Navigate to the project directory:
   ```bash
   cd drawzone
   ```
4. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Step 2: Creating a Plugin

1. Create a new directory for your plugin inside the `plugins` folder:
   ```bash
   mkdir plugins/my-plugin
   ```
2. Inside your plugin directory, create an `index.js` file. This will be the entry point for your plugin.

### Step 3: Writing Your Plugin

In your `index.js` file, you can define the functionality of your plugin. Here is a basic example of a plugin that greets a player when they join the game:

```javascript
module.exports = {
    install: function() {
        server.events.on("playerJoin", client => {
            client.send("Welcome to DrawZone!");
        });
    },
    name: "Greeting plugin",
    version: "1.0.0"
}
```