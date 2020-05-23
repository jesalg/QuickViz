const express = require('express');
const { execSync } = require("child_process");

var app = express();
app.set('view engine', 'pug')

app.get('/', function(req, res){
    const stdout = execSync(
        `pandoc -t chartss.lua infile.md`
    );
    res.render('index', { chart: String(stdout) })
});

app.listen(3000);