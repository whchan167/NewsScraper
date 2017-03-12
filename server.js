//Dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var request = require('request');
mongoose.Promise = Promise

//requiring bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//serve static content for app from the "public" folder
app.use(express.static('public'));
app.set(express.static(__dirname + '/views'));

//handlebars setting
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//import routes from controllers
var routes = require('./controllers/controller.js');
app.use("/", routes);

//setting up mongoose database
mongoose.connect("mongodb://heroku_mb89lpwt:i82hia6ke49j7n3nv3c78qe56b@ds129010.mlab.com:29010/heroku_mb89lpwt");
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//port listener
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('App running on port: ' + PORT);
});