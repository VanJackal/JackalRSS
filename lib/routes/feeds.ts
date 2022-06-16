import express = require('express')
import {Feed, Article} from "jrss-db";
import * as rss from 'rss-handler'

const router = express.Router()

// FEEDS
router.get('/feeds', async (req, res, next) => {//get list of feeds (and basic info for feed)
    if (!req.user) return res.sendStatus(401);
    //get feed data
    let feedsData = await Feed.find({ userid: req.user.id }, { feedid: 1, title: 1, folder: 1 });
    //get folders
    let folders = await Feed.aggregate([//TODO Simplify this to a single aggregate
        {
            "$match": { userid: req.user.id }
        },
        {
            "$group": {
                _id: "$folder"
            }
        }
    ])
    // get number of unread articles by feed
    const numUnread = await Article.aggregate([
        {
            "$match": { userid: req.user.id, read: false }
        },
        {
            "$group": {
                _id: "$feedid",
                count: { "$sum": 1 }
            }
        }
    ]);
    //map numUnread to feeds
    const feeds = feedsData.map((feedData) => {
        let feed = feedData._doc;
        const unread = numUnread.filter(unread => {
            return unread._id == feed._id
        })[0]?.count || 0;

        return { ...feed, unread: unread };
    })
    //map feeds to folders (dynamically create the list entries for each folder)
    const feedsFolded = [];
    folders.forEach((folder) => {
        if (folder._id) {//if folder is not null
            const folderFeeds = feeds.filter(feed => {
                return feed.folder === folder._id;
            })
            feedsFolded.push({ folder: folder._id, feeds: folderFeeds });
        }
    })
    const unfolded = feeds.filter(feed => {
        return !feed.folder;
    })
    if (unfolded) {
        feedsFolded.push({ folder: "Uncategorized", feeds: unfolded })
    }
    res.json(feedsFolded);
});

router.post('/feeds', (req, res, next) => {//add a new feed
    if (!req.user) return res.sendStatus(401);
    req.body.userid = req.user._id;
    Feed.insertMany([req.body]).then(res.json({ added: req.body.link }));
})

router.post('/feeds/:feedid', (req, res, next) => {//fetch new entries for the feed with 'feedid'
    if (!req.user) return res.sendStatus(401);
    rss.fetchFeed(req.params.feedid, req.user._id).then(data => res.json(data));
});

router.put('/feeds/:feedid', (req, res, next) => {//update feed entry
    if (!req.user) return res.sendStatus(401);
    Feed.findOneAndUpdate({ _id: req.params.feedid, userid: req.user._id }, req.body).then(data => res.json(data));
});

router.get('/feeds/:feedid', (req, res, next) => {//get feed entry
    if (!req.user) return res.sendStatus(401);
    Feed.findOne({ _id: req.params.feedid, userid: req.user._id }).then(data => res.json(data));
});

router.get('/feeds/:feedid/articles', (req, res, next) => { // Gets the list of articles for the feed with shortened info
    if (!req.user) return res.sendStatus(401);
    Article.find({ feedid: req.params.feedid, userid: req.user._id }, { title: 1, pubDate: 1, read: 1 }).then(data => res.json(data));
});

router.delete('/feeds/:feedid', (req, res, next) => {//Remove feed and its connected articles
    if (!req.user) return res.sendStatus(401);
    rss.removeFeed(req.params.feedid, req.user._id).then(data => res.json(data));
})

export {
    router
}