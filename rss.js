const Parser = require('rss-parser');
const parser = new Parser({
	customFields:{
		item:['summary']
	}
});
const Article = require('./models/article');
const Feed = require('./models/feed');
const crypto = require('crypto');

async function refreshAll(userid){
	const feeds = await Feed.find({userid:userid},{_id:1})
	let count = 0;
	feeds.forEach(async (feed) => {
		count += (await fetchFeed(feed._id,userid))
	})
	return {new:count};
}

async function fetchFeed(feedid,userid) {
	let url = (await Feed.findOne({_id:feedid,userid:userid},{link:1})).link;
	console.log(`${userid}   ${url}`);
	let feed = await parser.parseURL(url);
	let articles = [];
	let uuids = [];
	console.log(feed.title);

	feed.items.forEach(item => {
		let keyString = item.title + (item.content || item.summary) + item?.link + item?.enclosure;
		let uuid = crypto.createHash("sha1").update(keyString).digest('base64');
		uuids.push(uuid);
		let article = {
			feedid: feedid,
			title: item.title || "Title Not Found",
			description: item.content || item.summary || "Description Not Found",//TODO Change this so its assigned to a var beforehand
			pubDate: item?.pubDate,
			link: item?.link,
			enclosure: item?.enclosure,
			uuid:uuid,
			read:false,
			userid:userid,
		};

		articles.push(article);
	});
	let existing = (await Article.find({ uuid: { "$in": uuids }, feedid:feedid, userid:userid }, { uuid: 1, _id:0})).map(a => a.uuid);//Get existing article ids
	let newArticles = articles.filter(item => !existing.includes(item.uuid));//get array of only new articles
	await Article.insertMany(newArticles);//add new articles to db

	return { new: newArticles.length };
}

async function removeFeed(feedid,userid){
	let remArticles = await Article.deleteMany({userid:userid,feedid:feedid});
	let remFeeds = await Feed.deleteMany({userid:userid,_id:feedid});
	return {articles:remArticles,feeds:remFeeds};
}

async function getFeedInfo(feedUrl){
	let feed = await parser.parseURL(feedUrl);
	return {
		title: feed.title || "Default Title",
		description: feed.description || "No Description",
	};
}

module.exports = {
	fetchFeed: fetchFeed,
	removeFeed: removeFeed,
	getFeedInfo: getFeedInfo,
	refreshAll: refreshAll,
};
