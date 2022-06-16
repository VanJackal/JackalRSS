import express = require('express')
import {Article} from 'jrss-db'

const router = express.Router()

// ARTICLES
router.get('/articles/:id', (req, res, next) => { // Gets full info of the article with the given id
    if (!req.user) return res.sendStatus(401);
    Article.findOne({ _id: req.params.id, userid: req.user._id }).then(data => res.json(data));
});

router.put('/articles/:id', (req, res, next) => { // sets the readstate of the article with the given id (can also be used to update an entry)
    if (!req.user) return res.sendStatus(401);
    Article.findOneAndUpdate({ _id: req.params.id, userid: req.user._id }, req.body).then(data => res.json(data));
});

router.delete('/articles/:id', (req, res, next) => {// Delete article entry by id
    if (!req.user) return res.sendStatus(401);
    Article.findOneAndDelete({ _id: req.params.id, userid: req.user._id }).then(data => res.json(data));
});

export {
    router
}