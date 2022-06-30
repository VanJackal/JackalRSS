import express = require('express')
import * as rss from 'rss-handler'
import * as lib from './feedsLib'
import {requireAuth} from "./middleware";
import {isValidObjectId} from "mongoose";
import {logger} from 'logging'

const router = express.Router()

router.all("/*", requireAuth)

// /feeds
router.get('/', async (req, res) => {//get list of feeds (and basic info for feed)
    let feeds = await lib.getFeedsUnread(req.user._id)
    logger.trace(`${req.method} ${req.originalUrl} res:\n\t\t${JSON.stringify(feeds)}`)
    res.json(feeds);
});

router.post('/', async (req, res) => {//add a new feed
    let newFeed = await lib.createFeed(req.user._id,req.body)
    res.status(201)
    res.json(newFeed)
})

// /feeds/:feedid

router.all("/:feedid/*",(req, res, next) => {
    if(isValidObjectId(req.params.feedid)) {
        next()
    } else {
        logger.trace("Invalid feedid @ " + req.originalUrl)
        res.status(400)
    }
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

router.patch('/:feedid', async (req, res) => {//update feed entry
    let updated = await lib.patchFeed(req.user._id, req.params.feedid, req.body)
    res.json(updated)
});

router.get('/:feedid', async (req, res) => {//get feed entry
    let feed = await lib.getFeed(req.user._id, req.params.feedid)
    res.json(feed)
});

router.delete('/:feedid', async (req, res) => {//Remove feed and its connected articles
    let removed = rss.removeFeed(req.params.feedid, req.user._id)
    res.json(removed)
})

router.get('/:feedid/articles', async (req, res) => { // Gets the list of articles for the feed with shortened info
    let articles = await lib.getFeedArticles(req.user._id, req.params.feedid)
    res.json(articles)
});

export {
    router
}