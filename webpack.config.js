const path = require("path");

module.exports = {
    entry: "./client-src/bundle.js",
    output: {
        path: path.resolve(__dirname, "routing/client"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                loader: 'json-loader', // webpack v1
                type: 'javascript/auto', // webpack v4 and above
            },
        ],
    },
    mode: 'development',
}