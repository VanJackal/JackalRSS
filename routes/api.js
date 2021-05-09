const express = require('express');
const router = express.Router();

router.get('/articles', (req, res, next) => { // Gets the list of articles for the feed with shortened info
	
});

router.get('/articles/:id', (req, res, next) => { // Gets full info of the article with the given id

});

router.post('/articles', (req, res, next) => { // Fetches new articles and adds them to the database

});

router.put('/articles/:id', (req, res, next) => { // sets the readstate of the article with the given id

});

module.exports = router;
