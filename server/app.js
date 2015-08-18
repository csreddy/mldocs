/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var fs = require('fs');

// Setup server
var app = express();
 
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}))

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(cookieParser());

app.get("/offline.manifest", function(req, res){
  fs.readFile(__dirname+'/offline.manifest', 'utf8', function(err, data) {
  	res.header("Content-Type", "text/cache-manifest");
  	res.end(data);
  })
});


var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;