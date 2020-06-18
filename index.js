const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const { execSync } = require("child_process");
const upload = multer();

var NODE_ENV = process.env.NODE_ENV || 'development';
var pipEnv = NODE_ENV !== 'production' ? 'pipenv run ' : '';
var app = express();
var config = require('./webpack.config');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackAssets = require('express-webpack-assets');

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

app.post('/', function(req, res){
    var quickvizmd = req.body.quickvizmd;
    const dangerBase64 = Buffer.from(quickvizmd).toString('base64');
    const stdout = execSync(`echo "$(echo ${dangerBase64} | base64 --decode)" | ${pipEnv}pandoc -f markdown --filter graphviz.py -t chartss.lua`);
    res.json({ chart: String(stdout) });
});

app.listen(process.env.PORT || 3000)

module.exports = app;