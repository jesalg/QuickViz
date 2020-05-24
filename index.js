const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { execSync } = require("child_process");
const upload = multer();

var app = express();
app.set('view engine', 'pug')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(upload.array()); 

app.get('/', function(req, res){
    var quickvizmd = `### Quick visualizations in Markdown!
    
- Dogs: 39
- Cats: 7
- Lions: 36
- Tigers: 55
- Bears: 33
- Walruses: 30
`
    const stdout = execSync(`echo "${quickvizmd}" | pandoc -t chartss.lua -f markdown`);
    console.log(String(stdout));
    res.render('index', {quickvizmd: quickvizmd, chart: String(stdout) })
});

app.get('/about', function(req, res){
    res.render('about')
});

app.post('/', function(req, res){
    console.log('--------')
    console.log(req.body)
    console.log(req.body.quickvizmd)
    var quickvizmd = req.body.quickvizmd;
    const stdout = execSync(`echo "${quickvizmd}" | pandoc -t chartss.lua -f markdown`);
    res.json({ chart: String(stdout) });
});

app.listen(process.env.PORT || 3000)