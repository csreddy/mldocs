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

/*app.get("/offline.manifest", function(req, res){
  res.header("Content-Type", "text/cache-manifest");
  res.end(
  	'CACHE MANIFEST\n' +
  	'/client/index.html\n' +
  	'/client/app/main/main.html\n' +
  	'/client/app/main/navbar.html\n' +
  	'/client/app/main/result.html\n' +
  	'/client/app/main/search.html\n' +
  	'/client/app/main/sidebar.html' +
  	'/client/app/main/list.html\n' +
  	'/client/app/main/detail.html\n' +
  	'/client/app/main/main.js\n' + 
  	'/client/app/app.js\n' + 
  	'/client/app/main/main.controller.js\n' +  
  	'/client/app/main/main.css\n'+
  	'http://fonts.googleapis.com/icon?family=Material+Icons\n' 
  	);
});
*/

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;