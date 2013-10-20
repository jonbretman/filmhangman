#!/usr/bin/env node

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(3000);
console.log('Visit http://localhost:3000 for Hangman fun!');