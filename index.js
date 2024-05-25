const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
require("dotenv").config();
const config = require("./config.json");

const app = express();
const httpServer = http.createServer(app);

const Plugin = require("./modules/Plugin.js");
const { log, convertTime } = require("./modules/utils.js");

/**
 * Global server object that holds various server configurations and states.
 * @global
 * @type {Object}
 * @property {Array} worlds - An array to store world instances.
 * @property {Array} plugins - An array to store plugin instances.
 * @property {Object} config - Server configuration loaded from a JSON file.
 * @property {Object} env - Environment variables from the process environment.
 * @property {EventEmitter} events - EventEmitter instance to emit server events.
 */
global.server = {
    worlds: [],
    plugins: [],
    config,
    env: process.env,
    events: new EventEmitter()
}

require("./modules/io.js")(httpServer);

function followSyntax(plugin) {
    if(typeof plugin.name == "string" &&
        typeof plugin.version == "string" &&
        typeof plugin.install == "function") return true;
    else return false;
}

function loadPlugins() {
    const folder = path.join(__dirname, 'plugins');
    fs.readdirSync(folder).forEach(file => {
        const filePath = path.join(folder, file);
        let plugin;

        if (fs.statSync(filePath).isDirectory()) {
            if (file.startsWith("-")) return;
            const pluginIndex = path.join(filePath, 'index.js');
            if (!fs.existsSync(pluginIndex)) return;
            plugin = require(pluginIndex);
            plugin.filename = file;
        } else {
            if (!file.endsWith(".js") || file.startsWith("-")) return;
            plugin = require(filePath);
            plugin.filename = file;
        }

        plugin.loaded = true;
        
        if (plugin.loaded) {
            log(`${plugin.name}`, `Loading ${plugin.name} v${plugin.version}`);
            if (followSyntax(plugin)) {
                const start = Date.now();
                plugin.install();
                const end = Date.now();
                plugin.took = end - start;
                log(`${plugin.name}`, `Enabling ${plugin.name} v${plugin.version} took ${convertTime(plugin.took / 1000)}`);
            } else {
                plugin.loaded = false;
                log("ERROR", `Could not load '${filePath}'\nDoesn't follow syntax`);
            }
        }
        server.plugins.push(new Plugin(plugin));
    });
}

loadPlugins();

const files = [];
const getFilesRecursively = function(directory) {
    const filesInDirectory = fs.readdirSync(directory);
    for(let i = 0; i < filesInDirectory.length; i++) {
        const file = filesInDirectory[i];
        let absolute = path.join(directory, file);
        if(fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            files.push(absolute);
            let routePath = '/' + path.relative("routing/client/", absolute).split(path.sep).join('/');
            app.get(routePath, function(req, res) {
                return res.sendFile(absolute, {
                    root: '.'
                });
            });
        }
    }
}
getFilesRecursively("./routing/client/");

// Route shared documents with the client
{
    const srcPath = path.join(__dirname, "modules", "shared", "ranks.json");
    const destPath = path.join(__dirname, 'client-src', 'shared', "ranks.json");

    fs.copyFile(srcPath, destPath, (err) => {
        if (err) throw err;
    });
}

app.get("/:worldName?", (req, res) => {
    return res.sendFile("./routing/client/index.html", {
        root: '.'
    });
});

httpServer.listen(config.port, () => {
    log("INFO", `Server is running at *:${config.port}`);
}); 