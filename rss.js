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
		let feedid = "TestFeed";//temp
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
	console.log(uuids);
	let existing = (await Article.find({ uuid: { "$in": uuids } }, { uuid: 1, _id:0})).map(a => a.uuid);//Get existing article ids
	console.log(existing);
	let newArticles = articles.filter(item => !existing.includes(item.uuid));//get array of only new articles
	await Article.insertMany(newArticles);//add new articles to db

	return { new: newArticles.length };
}

module.exports = {
	fetchFeed: fetchFeed
};
