const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { execSync } = require("child_process");
const upload = multer();

var NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var config = require('./webpack.config');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackAssets = require('express-webpack-assets');


app.set('view engine', 'pug')
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
    var quickvizmd = `# Quick visualizations in Markdown!
## Bar Charts    
- Dogs: 39
- Cats: 7
- Lions: 36
- Tigers: 55
- Bears: 33
- Walruses: 30

## Scatter Plots

- (15,12)
- (0.25,6.78)
- (-.7,9)
- (-4,-6)

## Line Plot

* 1.5 : 3.3
* 3 : -1.2
* 4.5 : 0
* 6 : 0
* 7.5 : 1.5
* 9 : 4
* 10.5 : 8

## Stacked Bar

* Dogs : 20+
* Cats : 10+
* Lions : 30+
* Tigers : 15+
* Bears : 20+

## Waterfall Chart

- Animals: 95=
- Dogs: 20+
- Cats: 10+
- Lions: 30+
- Tigers: 15+
- Bears: 20+
    `
    const stdout = execSync(`echo "${quickvizmd}" | pandoc -t chartss.lua -f markdown`);
    res.render('index', {quickvizmd: quickvizmd, chart: String(stdout) })
});

app.post('/', function(req, res){
    var quickvizmd = req.body.quickvizmd;
    const stdout = execSync(`echo "${quickvizmd}" | pandoc -t chartss.lua -f markdown`);
    res.json({ chart: String(stdout) });
});

app.listen(process.env.PORT || 3000)