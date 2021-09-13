const Parser = require('rss-parser');
const parser = new Parser();
const Article = require('./models/article');
const Feed = require('./models/feed');
const crypto = require('crypto');

async function fetchFeed(feedid) {
	let url = (await Feed.findOne({feedid:feedid},{link:1})).link;
	let feed = await parser.parseURL(url);
	let articles = [];
	let uuids = [];
	console.log(feed.title);

	feed.items.forEach(item => {
		let keyString = item.title + item.content + item?.link + item?.enclosure;
		let uuid = crypto.createHash("sha1").update(keyString).digest('base64');
		uuids.push(uuid);
		let article = {
			feedid: feedid,
			title: item.title,
			description: item.content,
			pubDate: item?.pubDate,
			link: item?.link,
			enclosure: item?.enclosure,
			uuid:uuid,
			read:false,
		};

		articles.push(article);
	});
	let existing = (await Article.find({ uuid: { "$in": uuids }, feedid:feedid }, { uuid: 1, _id:0})).map(a => a.uuid);//Get existing article ids
	let newArticles = articles.filter(item => !existing.includes(item.uuid));//get array of only new articles
	await Article.insertMany(newArticles);//add new articles to db

	return { new: newArticles.length };
}

module.exports = {
	fetchFeed: fetchFeed
};
