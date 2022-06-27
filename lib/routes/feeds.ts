import express = require('express')
import {Feed, Article} from "jrss-db";
import * as rss from 'rss-handler'
import * as lib from './feedsLib'

const router = express.Router()

router.all("/*", (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    next();
})

// FEEDS
router.get('/', async (req, res) => {//get list of feeds (and basic info for feed)
    let feeds = lib.getFeedsUnread(req.user._id)
    res.json(feeds);
});

router.post('/', async (req, res) => {//add a new feed
    let newFeed = await lib.createFeed(req.user._id,req.body)
    res.status(201)
    res.json(newFeed)
})

router.post('/:feedid', async (req, res) => {//fetch new entries for the feed with 'feedid'
    try {
        let newCount = await rss.fetchFeed(req.params.feedid, req.user._id)
        res.status(200)
        res.json(newCount)
    } catch (e) {
        res.status(500)
        res.json({
            message:`There was an error when fetching ${req.params.feedid}`,
            error:e
        })
    }
});

router.patch('/:feedid', (req, res) => {//update feed entry
    Feed.findOneAndUpdate({ _id: req.params.feedid, userid: req.user._id }, req.body).then(data => res.json(data));
});

router.get('/:feedid', (req, res) => {//get feed entry
    Feed.findOne({ _id: req.params.feedid, userid: req.user._id }).then(data => res.json(data));
});

router.get('/:feedid/articles', (req, res) => { // Gets the list of articles for the feed with shortened info
    Article.find({ feedid: req.params.feedid, userid: req.user._id }, { title: 1, pubDate: 1, read: 1 }).then(data => res.json(data));
});

router.delete('/:feedid', async (req, res) => {//Remove feed and its connected articles
    let removed = rss.removeFeed(req.params.feedid, req.user._id)
    res.json(removed)
})

export {
    router
}