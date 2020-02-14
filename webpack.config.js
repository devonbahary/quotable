const path = require('path');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        port: 4000,
        publicPath: '/dist/',
        proxy: {
            '/api': "http://localhost:5000",
        },
    },
    entry: "./src/App.js",
    output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/,
        }, {
            test: /\.(s*)css$/,
            loader: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: process.env.NODE_ENV === 'dev' ? '[path][name]__[local]' : '[hash:base64]',
                        },
                    },
                },
                'sass-loader',
            ],
        }],
    },
};