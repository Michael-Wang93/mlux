var path = require('path')
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, '..', 'bin', 'assets', 'js')
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  getCustomTransformers: () => ({
                    before: [ tsImportPluginFactory( /** options */) ]
                  }),
                  compilerOptions: {
                    module: 'es2015'
                  }
                },
                exclude: /node_modules/
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".scss"]
    },
};