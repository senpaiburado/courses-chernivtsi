var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : {
        main: './static/React/main.js',
        login: './static/React/LoginFormComponent.js'
    },
    output : {
        path : path.resolve(__dirname , './static/dist'),
        filename: '[name].js'
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    mode:'development',
    plugins : [
        new HtmlWebpackPlugin ({
            template : './static/react.html'
        })
    ]
};

