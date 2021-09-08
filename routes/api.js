const express = require('express');
const router = express.Router();
const rss = require('../rss');
const Article = require('../models/article');
const Feed = require('../models/feed');

// ARTICLES
router.get('/articles', (req, res, next) => { // Gets(including fetching new articles) the list of articles for the feed with shortened info
    Article.find({}, {title:1, pubDate:1,read:1}).then(data => res.json(data));
});

router.post('/articles', (req, res, next) => {//TODO Move this functionality to a 'feeds' route
    rss.fetchFeed(req.body.url).then(data => res.json(data));
});

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
router.get('/feeds', (req, res, next) => {
	Feed.find({}, {feedid:1}).then(data => res.json(data));
});

router.post('/feeds', (req, res, next) => {
	Feed.insertMany([req.body]).then(res.json({added:req.body.feedid}));
})

module.exports = router;
