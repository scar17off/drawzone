const fs = require("fs");
const path = require("path");
const { log, convertTime } = require("./utils.js");

/**
 * Checks if a plugin follows the correct syntax
 * @param {Object} plugin - The plugin to check
 * @returns {Boolean} - Returns true if the plugin follows the correct syntax, false otherwise
 */
function followSyntax(plugin) {
    if(typeof plugin.name == "string" &&
        typeof plugin.version == "string" &&
        typeof plugin.install == "function") return true;
    else return false;
}

/**
 * Represents a plugin with its properties.
 */
class Plugin {
    /**
     * Constructs an instance of the Plugin class.
     * @param {Object} props - The properties of the plugin.
     */
	constructor(props) {
		this.name = props.name;
		this.version = props.version;
		this.install = props.install;
		this.onload = props.onload;
		this.filename = props.file;
		this.took = props.took;
		this.loaded = props.loaded;
	}
}

/**
 * Loads plugins from the plugins directory and initializes them.
 */
function loadPlugins() {
    const folder = path.join(__dirname, "../plugins");
    fs.readdirSync(folder).forEach(file => {
        const filePath = path.join(folder, file);
        let plugin;

        if(fs.statSync(filePath).isDirectory()) {
            if(file.startsWith("-")) return;
            const pluginIndex = path.join(filePath, "index.js");
            if(!fs.existsSync(pluginIndex)) return;
            plugin = require(pluginIndex);
            plugin.filename = file;
        } else {
            if(!file.endsWith(".js") || file.startsWith("-")) return;
            plugin = require(filePath);
            plugin.filename = file;
        }

        plugin.loaded = true;
        
        if(plugin.loaded) {
            log(`${plugin.name}`, `Loading ${plugin.name} v${plugin.version}`);
            if(followSyntax(plugin)) {
                const start = Date.now();
                plugin.install();
                const end = Date.now();
                plugin.took = end - start;
                log(`${plugin.name}`, `Enabling ${plugin.name} v${plugin.version} took ${convertTime(plugin.took / 1000)}`);
            } else {
                plugin.loaded = false;
                log("ERROR", `Could not load "${filePath}"\nDoesn't follow syntax`);
            }
        }
        server.plugins.push(new Plugin(plugin));
    });
}

loadPlugins();