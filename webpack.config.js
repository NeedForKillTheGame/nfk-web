module.exports = {
    entry: "./src/app.js",
    output: {
        path: __dirname + "/build",
        filename: "gamebuild.js",
        publicPath: '/build/'
    },
    externals: {
        "PIXI": "PIXI",
        "Stats": "Stats",
        "Howl": "Howl"
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};