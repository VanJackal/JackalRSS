import express = require('express')
import {Feed} from "../jrss-db";
import rss = require('rss-handler')

const router = express.Router()

//UTIL
router.post('/util/feeds/info', (req, res, next) => { //gets the info from an rss feed
    rss.getFeedInfo(req.body.url).then(data => res.json(data));
})

router.post('/util/feeds/refresh', (req, res, next) =>{
    if (!req.user) return res.sendStatus(401);
    rss.refreshAll(req.user._id).then((data) => res.json(data));
})

router.get('/util/feeds/folders',async (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
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