// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

//initialize express routers
var Router = express.Router()

var Comment = require('../models/comment.js');
var News = require('../models/news.js');


Router.get('/', function(req, res) {
  res.render("index");
});

// Scrape data from one site and place it into the mongodb db
Router.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://finance.yahoo.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
  
    // For each element with a "title" class
    $("h3").each(function(i, element) {

      var result = {};
    
        // Save the text of each link enclosed in the current element
      result.title = $(this).children("a").text();
      // Save the href value of each link enclosed in the current element
      result.link = $(this).children("a").attr("href");
      //push all result object in array

        // using new News model, create a new entry.
        // Notice the (result):
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new News (result);
    
        // now, save that entry to the db
        entry.save(function(err, doc) {
          // log any errors
          if (err) {
            console.log(err);
          } 
          // or log the doc
          else {
            console.log("this is all the data_________________________")
            console.log(doc);
            res.redirect("/news")
          }
        });
    })
  });
});

// Retrieve data from the db
Router.get("/news", function(req, res) {
  // Find all results from the news collection in the db
  News.find({}, function(error, doc) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      res.json(doc);
    }
  });
});

Router.get('/news/:id', function(req, res) {
    News.findOne({ '_id': req.params.id })
        .populate('comment')
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        });
});

Router.post('/news/:id', function(req, res) {
    var newComment = new Comment(req.body);
    newComment.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            News.findOneAndUpdate({ '_id': req.params.id }, { 'comment': doc._id })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});

module.exports = Router