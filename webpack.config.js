const path = require("path");

module.exports = {
    entry: "./client-src/bundle.js",
    output: {
        path: path.resolve(__dirname, "routing/client"),
        filename: "bundle.js",
    }
};