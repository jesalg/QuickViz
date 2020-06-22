const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const { execSync } = require("child_process");
const upload = multer();

const NODE_ENV = process.env.NODE_ENV || 'development';
const pipEnv = NODE_ENV !== 'production' ? 'pipenv run ' : '';
const app = express();
const config = require('./webpack.config');
const webpack = require('webpack');
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackAssets = require('express-webpack-assets');

io.on('connection', (socket) => {
    socket.on('quickvizmd', (data) => {
        var quickvizmd = data;
        const dangerBase64 = Buffer.from(quickvizmd).toString('base64');
        const stdout = execSync(`echo "$(echo ${dangerBase64} | base64 --decode)" | ${pipEnv}pandoc -f markdown --filter graphviz.py -t chartss.lua`);
        socket.emit('quickvizhtml', { chart: String(stdout) });
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(upload.array()); 

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    const compiler = webpack(config)
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true }
    }))
    app.use(webpackHotMiddleware(compiler))
}
app.use(webpackAssets('./config/webpack-assets.json', {
    devMode: NODE_ENV !== 'production'
}));

app.get('/', function(req, res){
    fs.readFile('public/input.md', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var quickvizmd = data;
        const dangerBase64 = Buffer.from(quickvizmd).toString('base64');
        const stdout = execSync(`echo "$(echo ${dangerBase64} | base64 --decode)" | ${pipEnv}pandoc -f markdown --filter graphviz.py -t chartss.lua`);
        res.render('index', {quickvizmd: quickvizmd, chart: String(stdout) })
    });
    
});

httpServer.listen(process.env.PORT || 3000)

module.exports = app;