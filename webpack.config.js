const path = require('path');

module.exports = {
    entry: {
        app: './client/maker.jsx',
        login: './client/login.jsx',
        account: './client/account.jsx'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                options: {
                        envName: 'production',
                    },
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};

//Uncaught TypeError: (0 , e.jsxDEV) is not a function at window.onload (loginBundle.js:2:221978)
//I kept getting this error after i checked my code was exactly correct several times
//I went to ai for debugging after i couldnt troubleshoot on my own and my code started working
//after including the options section on my laptop