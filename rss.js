const Parser = require('rss-parser');
const parser = new Parser();
const Article = require('./models/article');

async function fetchFeed(url){
	let feed = await parser.parseURL(url);
	console.log(feed.title);
	numArticles = 0;
	feed.items.forEach(item => {
		Article.create({title:item.title});
		numArticles++;
	});
	return {new:numArticles};
}

module.exports = {
	fetchFeed: fetchFeed
};