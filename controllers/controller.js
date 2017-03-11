
// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

//initialize express routers
var Router = express.Router()

var Comment = require('../models/comment.js');
var Article = require('../models/article.js');


Router.get('/', function(req, res) {
  res.render("index");
});

// Scrape data from one site and place it into the mongodb db
Router.get("/scrape", function(req, res) {
  
  // Make a request for the news section of ycombinator
  request("https://www.cnbc.com", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
  
    // For each element with a "title" class
    $(".headline").each(function(i, element) {

      var result = {};
      
        // Save the text of each link enclosed in the current element
      result.title = $(this).children("a").text();
      // Save the href value of each link enclosed in the current element
      result.link = "https://www.cnbc.com" + $(this).children("a").attr("href");

        if ( $(this).children("a").attr("href") ===!"undefined"){
        // using new Article model, create a new entry.
        // Notice the (result):
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article (result);
    
        // now, save that entry to the db
        entry.save(function(err, doc) {
          // log any errors
          if (err) {
            console.log(err);
          } 
          // or log the doc
          else {
            res.json(doc);
          }
        })
       } 
      });
    });
});

// Retrieve data from the db
    Router.get("/article", function(req, res) {
  // Find all results from the article collection in the db
      Article.find({}, function(error, doc) {
    // Throw any errors to the console
        if (error) {
          consloe.log(error);
        }
    // If there are no errors, send the data to the browser as a json
        else {
           res.json(doc);
        }
      });
    });

Router.get('/article/:id', function(req, res) {
    Article.findOne({ '_id': req.params.id })
          .populate('comment')
          .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log("this is doc" + doc)
                res.send(doc);
            }
        });
});

// Route to delete notes
Router.post('/deletecomment/:id', function(req, res) {
  Comment.findOne({ '_id': req.params.id })
            .remove('comment')
            .exec(function(err, doc) {
            if (err) {
              console.log(err);
             } else {
            res.json(doc);
          }
      });
    });

Router.post('/article/:id', function(req, res) {
    var newComment = new Comment(req.body);
    newComment.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            Article.findOneAndUpdate({ '_id': req.params.id }, { 'comment': doc._id })
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