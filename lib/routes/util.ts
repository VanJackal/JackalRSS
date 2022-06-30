import express = require('express')
import {Feed} from "../jrss-db";
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
    rss.refreshAll(req.user._id).then((data) => res.json(data));
})

router.get('/feeds/folders',async (req, res) => {//TODO this needs to be moved to a folders.ts route file
    if (!req.user) return res.sendStatus(401);
    logger.error('GET /util/feeds/folders -> route not properly implemented')
    const foldersObj = await Feed.aggregate([
        {
            "$match": { userid: req.user.id }
        },
        {
            "$group": {
                _id: "$folder"
            }
        }
    ]);

    const folders = foldersObj.map(folder => {
        return folder._id;
    })

    res.json(folders.filter(folder=>{
        return folder ? folder != false : false;//if the folder isnt null or an empty string
    }))
})

export {
    router
}