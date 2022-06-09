import Parser = require("rss-parser");

const parser = new Parser({
	customFields:{
		item:['summary']
	}
});
import {Article, IArticle} from "./lib/models/article";
import {createHash} from 'crypto'

const Feed = require('./lib/models/feed');

type feedInfo = {
	title:string,
	description:string
}

/**
 * refresh/fetch new articles from all feeds for a user
 * @param userid userid of feeds to fetch
 * @returns Promise<number> amount of new articles
 */
async function refreshAll(userid) : Promise<number>{
	const feeds = await Feed.find({userid:userid},{_id:1})
	let count = 0;
	feeds.forEach(async (feed) => {//TODO make this handle the promises properly
		count += (await fetchFeed(feed._id,userid))
	})
	return count;
}

function getArticleUUID(item: { [p: string]: any } & Parser.Item) {
	let keyString = item.title + (item.content || item.summary) + item?.link + item?.enclosure;
	return createHash("sha1").update(keyString).digest('base64');
}

function getArticle(feedid, item: { [p: string]: any } & Parser.Item, uuid: string, userid):IArticle {
	return {
		feedid: feedid,
		title: item.title || "Title Not Found",
		description: item.content || item.summary || "Description Not Found",//TODO Change this so its assigned to a var beforehand
		pubDate: (item?.pubDate ? new Date(item.pubDate) : null),
		link: item?.link,
		enclosure: item?.enclosure,
		uuid: uuid,
		read: false,
		userid: userid,
	};
}

/**
 * update articles in a users feed
 *
 * @param feedid id of the feed to update
 * @param userid id of user this feed belongs to
 * @returns Promise<number> amount of new articles
 */
async function fetchFeed(feedid,userid):Promise<number> {
	let url = (await Feed.findOne({_id:feedid,userid:userid},{link:1})).link;
	console.log(`${userid}   ${url}`);
	let feed = await parser.parseURL(url);
	let articles:IArticle[] = [];
	let uuids = [];
	console.log(feed.title);

	//store each article as an IArticle
	feed.items.forEach(item => {
		let uuid = getArticleUUID(item);
		uuids.push(uuid);
		let article:IArticle = getArticle(feedid, item, uuid, userid);
		articles.push(article);
	});
	//Get existing article uuids
	let existing = (await Article.find({ uuid: { "$in": uuids }, feedid:feedid, userid:userid },
		{ uuid: 1, _id:0})).map(a => a.uuid);
	//get array of only new articles (filter out articles whose uuid is in existing)
	let newArticles = articles.filter(item => !existing.includes(item.uuid));
	await Article.insertMany(newArticles);//add new articles to db

	return newArticles.length;
}

async function removeFeed(feedid,userid){
	let remArticles = await Article.deleteMany({userid:userid,feedid:feedid});
	let remFeeds = await Feed.deleteMany({userid:userid,_id:feedid});
	return {articles:remArticles,feeds:remFeeds};
}

/**
 * get info for a feed from remote url
 * @param feedUrl url to get the info of (contains title and description)
 *
 * @returns Promise<feedInfo> info of remote feed
 */
async function getFeedInfo(feedUrl):Promise<feedInfo>{
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
