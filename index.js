const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
require("dotenv").config();
const config = require("./config.json");

const app = express();
const httpServer = http.createServer(app);

const { log } = require("./modules/utils.js");

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
require("./modules/plugins.js");

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