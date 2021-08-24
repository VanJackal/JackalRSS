const Parser = require('rss-parser');
const parser = new Parser();
const Article = require('./models/article');
const crypto = require('crypto');

async function fetchFeed(url) {
	let feed = await parser.parseURL(url);
	let articles = [];
	let uuids = [];
	console.log(feed.title);
	feed.items.forEach(item => {
		let article = {
			feedid: "TestFeed",// Feed for testing (temp)
			title: item.title,
			description: item.content,
			pubDate: item?.pubDate,
			link: item?.link,
			enclosure: item?.enclosure,
			//content:item?.nothing
		};
		let keyString = article.feedid + article.title + article.description + article.pubDate + article.link + article.enclosure;

		article.uuid = crypto.createHash("sha1").update(keyString).digest('base64');
		uuids.push(article.uuid);
		articles.push(article);
	});
	console.log(uuids)
	let existing = await Article.find({ uuid: { "$in": uuids } }, { uuid: 1 });//Get existing article ids
	console.log(existing)
	let newArticles = articles.filter(item => !existing.includes(item.uuid));//get array of only new articles
	console.log(newArticles)
	await Article.insertMany(newArticles);//add new articles to db

	return { new: newArticles.length };
}

module.exports = {
	fetchFeed: fetchFeed
};
