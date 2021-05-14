const express = require('express');
const router = express.Router();
const rss = require('../rss');
const Article = require('../models/article');

router.get('/articles', (req, res, next) => { // Gets(including fetching new articles) the list of articles for the feed with shortened info
    Article.find({}, 'title').then(data => res.json(data));
});

router.post('/articles', (req, res, next) => {
    //console.log(req.body.url);
    rss.fetchFeed(req.body.url).then(data => res.json(data));
});

router.get('/articles/:id', (req, res, next) => { // Gets full info of the article with the given id

});

router.put('/articles/:id', (req, res, next) => { // sets the readstate of the article with the given id

});

router.delete('/articles/:id', (req, res, next) => {
	Article.findByIdAndDelete(req.params.id).then(data => res.json(data));
});

module.exports = router;
