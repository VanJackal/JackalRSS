import express = require('express')
import rss = require('rss-handler')
import {logger} from 'logging'

const router = express.Router()

//UTIL
router.post('/feeds/info', async (req, res) => { //gets the info from an rss feed
    logger.debug(`Getting feed info for ${req.body.url}`)
    try {
        let feedInfo = await rss.getFeedInfo(req.body.url)
        res.status(200)
        res.json(feedInfo);
    } catch (e) {
        logger.debug("Error in /util/feeds/info")
        res.status(500)
        res.json({message:"There was an issue fetching the remote feed, this may mean there is no feed at the url"})
    }
})

router.post('/feeds/refresh', (req, res) =>{
    if (!req.user) return res.sendStatus(401);
    try {
        rss.refreshAll(req.user._id).then((data) => res.json(data));
    } catch (e) {
        res.sendStatus(500)
    }
})

export {
    router
}