const Parser = require('rss-parser');
const parser = new Parser();
const Article = require('./models/article');

async function fetchFeed(url){
	let feed = await parser.parseURL(url);
	console.log(feed.title);
	await feed.items.forEach(async item => await addItem(item))
}

async function addItem(item){
	await console.log(item.title + " : " + item.link);
	return Article.create({title:item.title})
}

module.exports = {
	fetchFeed: fetchFeed
};