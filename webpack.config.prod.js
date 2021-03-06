const path = require('path');
const cleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/app.js',
    output: {
        filename: 'app.min.js',
        path: path.resolve(__dirname, 'assets', 'scripts/dist/'),
        publicPath: 'assets/scripts/dist/',
    },
    devServer: {
        contentBase: './',
    },
    devtool: 'cheap-source-map',
    plugins: [new cleanPlugin.CleanWebpackPlugin()],
};