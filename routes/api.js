const express = require('express');
const router = express.Router();
const rss = require('../rss');
const Article = require('../models/article');
const Feed = require('../models/feed');

// ARTICLES
router.get('/articles/:id', (req, res, next) => { // Gets full info of the article with the given id
	if(!req.user) return res.sendStatus(401);
	Article.findOne({_id:req.params.id,userid:req.user._id}).then(data => res.json(data));
});

router.put('/articles/:id', (req, res, next) => { // sets the readstate of the article with the given id (can also be used to update an entry)
	if(!req.user) return res.sendStatus(401);
	Article.findOneAndUpdate({_id:req.params.id,userid:req.user._id},req.body).then(data => res.json(data));
});

router.delete('/articles/:id', (req, res, next) => {// Delete article entry by id
	if(!req.user) return res.sendStatus(401);
	Article.findOneAndDelete({_id:req.params.id,userid:req.user._id}).then(data => res.json(data));
});

// FEEDS
router.get('/feeds', (req, res, next) => {//get list of feeds (and basic info for feed)
	if(!req.user) return res.sendStatus(401);
	Feed.find({userid:req.user.id}, {title:1}).then(data => res.json(data));
});

router.post('/feeds', (req, res, next) => {//add a new feed
	if(!req.user) return res.sendStatus(401);
	req.body.userid = req.user._id;
	Feed.insertMany([req.body]).then(res.json({added:req.body.link}));
})

router.post('/feeds/:feedid', (req, res, next) => {//fetch new entries for the feed with 'feedid'
	if(!req.user) return res.sendStatus(401);
    rss.fetchFeed(req.params.feedid,req.user._id).then(data => res.json(data));
});

router.get('/feeds/:feedid/articles', (req, res, next) => { // Gets the list of articles for the feed with shortened info
	if(!req.user) return res.sendStatus(401);
    Article.find({feedid:req.params.feedid,userid:req.user._id}, {title:1, pubDate:1,read:1}).then(data => res.json(data));
});

router.delete('/feeds/:feedid', (req, res, next) => {//Remove feed and its connected articles
	if(!req.user) return res.sendStatus(401);
	rss.removeFeed(req.params.feedid,req.user._id).then(data => res.json(data));
})

//UTIL
router.post('/util/feeds/info', (req, res, next) => { //gets the info from an rss feed
	rss.getFeedInfo(req.body.url).then(data => res.json(data));
})

module.exports = router;
