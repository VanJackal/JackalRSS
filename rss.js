const Parser = require('rss-parser');
const parser = new Parser();
const Article = require('./models/article');

async function fetchFeed(url){
	let feed = await parser.parseURL(url);
	console.log(feed.title);
	numArticles = 0;
	feed.items.forEach(item => {
		Article.create({
			feedid:"TestFeed",// Feed for testing (temp)
			title:item.title,
			description:item.content,
			pubDate:item?.pubDate,
			link:item?.link,
			enclosure:item?.enclosure,
			//content:item?.nothing
		});
		numArticles++;
	});
	return {new:numArticles};
}

module.exports = {
	fetchFeed: fetchFeed
};
