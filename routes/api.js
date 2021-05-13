const express = require('express');
const router = express.Router();
const rss = require('../rss');
const Article = require('../models/article');

router.get('/articles', async (req, res, next) => { // Gets(including fetching new articles) the list of articles for the feed with shortened info
    await rss.fetchFeed(req.body.url);
    Article.find({}, 'title').then(data => res.json(data))
});

router.get('/articles/:id', (req, res, next) => { // Gets full info of the article with the given id

});

router.put('/articles/:id', (req, res, next) => { // sets the readstate of the article with the given id

});

module.exports = router;
