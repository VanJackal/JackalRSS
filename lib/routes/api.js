const express = require('express');
const router = express.Router();
const rss = require('../rss/rss');
const Article = require('../jrss-db/article').Article;
const Feed = require('../jrss-db/feed').Feed;
const passport = require('passport');
//TODO Seperate this into multiple files with prefixed routes
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
	unfolded ? feedsFolded.push({ folder: "Uncategorized", feeds: unfolded }) : _;
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

module.exports = router;
