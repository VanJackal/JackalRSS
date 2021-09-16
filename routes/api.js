const express = require('express');
const router = express.Router();
const rss = require('../rss');
const Article = require('../models/article');
const Feed = require('../models/feed');

// ARTICLES
router.get('/articles/:id', (req, res, next) => { // Gets full info of the article with the given id
	Article.findById(req.params.id).then(data => res.json(data));
});

router.put('/articles/:id', (req, res, next) => { // sets the readstate of the article with the given id (can also be used to update an entry)
	Article.findByIdAndUpdate(req.params.id,req.body).then(data => res.json(data));
});

router.delete('/articles/:id', (req, res, next) => {// Delete article entry by id
	Article.findByIdAndDelete(req.params.id).then(data => res.json(data));
});

// FEEDS
router.get('/feeds', (req, res, next) => {//get list of feeds (and basic info for feed)
	Feed.find({}, {title:1}).then(data => res.json(data));
});

router.post('/feeds', (req, res, next) => {//add a new feed
	Feed.insertMany([req.body]).then(res.json({added:req.body.link}));
})

router.post('/feeds/:feedid', (req, res, next) => {//fetch new entries for the feed with 'feedid'
    rss.fetchFeed(req.params.feedid).then(data => res.json(data));
});

router.get('/feeds/:feedid/articles', (req, res, next) => { // Gets the list of articles for the feed with shortened info
    Article.find({feedid:req.params.feedid}, {title:1, pubDate:1,read:1}).then(data => res.json(data));
});

router.delete('/feeds/:feedid', (req, res, next) => {//Remove feed and its connected articles
	rss.removeFeed(req.params.feedid).then(data => res.json(data));
})

router.post('/util/feeds/info', (req, res, next) => { //gets the info from an rss feed
	rss.getFeedInfo(req.body.url).then(data => res.json(data));
})

module.exports = router;
