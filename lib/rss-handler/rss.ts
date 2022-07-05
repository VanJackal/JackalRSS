import Parser = require("rss-parser");
import {logger} from 'logging'

const parser = new Parser({
	customFields:{
		item:['summary']
	}
});
import {Article, IArticle, Feed, IFeed} from 'jrss-db';
import {Types, Document} from 'mongoose'
import {createHash} from 'crypto'


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
	logger.info(`Refreshing all feeds for user (${userid})`)

	const feeds:(IFeed & Document)[] = await Feed.find({userid:userid},{_id:1}).exec()
	let count = 0;
	let countP:Promise<number>[] = []
	//start asynchronous feed fetch for all feeds
	for (let i = 0; i < feeds.length; i++) {
		countP.push(fetchFeed(feeds[i]._id, userid))
	}
	//collect promises and count total number of new articles
	let counts:number[] = await Promise.all(countP);
	counts.forEach((n) => {
		count += n;
	})
	logger.info(`(${userid}) ${count} total new articles`)
	return count;
}

/**
 * get uuid of article
 * uuid is a sha1 hash of the title, content, link, and enclosure of the article
 *
 * @param item article details
 * @returns string uuid of the article
 */
function getArticleUUID(item: { [p: string]: any } & Parser.Item):string {
	let keyString = item.title + (item.content || item.summary) + item?.link + item?.enclosure;
	return createHash("sha1").update(keyString).digest('base64');
}

/**
 * create an article object which conforms to the IArticle interface
 *
 * @param feedid id of the articles feed
 * @param item article info object
 * @param uuid unique sha1 hash of the article
 * @param userid id of the articles user
 *
 * @returns IArticle
 */
function getArticle(feedid:Types.ObjectId, item: { [p: string]: any } & Parser.Item, uuid: string, userid:Types.ObjectId):IArticle {
	return {
		feedid: feedid,
		title: item.title || "Title Not Found",
		description: item.content || item.summary || "Description Not Found",//TODO Change this so its assigned to a var beforehand
		pubDate: (item?.pubDate ? new Date(item.pubDate) : new Date()),
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
	logger.trace(`fetchFeed(${feedid}, ${userid})`)
	let url = (await Feed.findOne({_id:feedid,userid:userid},{link:1})).link;
	logger.debug(`(${userid}) Fetching ${feedid}(${url})`);
	let feed = await parser.parseURL(url);
	logger.trace(`(${userid}) parsed ${url}(${feedid}) - Title: ${feed.title}`)
	let articles:IArticle[] = [];
	let uuids = [];

	//store each article as an IArticle
	feed.items.forEach(item => {
		let uuid = getArticleUUID(item);
		uuids.push(uuid);
		let article:IArticle = getArticle(feedid, item, uuid, userid);
		articles.push(article);
	});
	//Get list existing article uuids
	let existing = (await Article.find({ uuid: { "$in": uuids }, feedid:feedid, userid:userid },
		{ uuid: 1, _id:0})).map(a => a.uuid);
	//get array of only new articles (filter out articles whose uuid is in existing)
	let newArticles = articles.filter(item => !existing.includes(item.uuid));
	await Article.insertMany(newArticles);//add new articles to db

	logger.trace(`fetched ${newArticles.length} in ${feedid}`)
	return newArticles.length;
}

/**
 * remove a feed and its articles from the db
 * @param feedid id of the feed to remove
 * @param userid id of the feeds user
 * @returns Promise<number> number of removed articles
 */
async function removeFeed(feedid,userid):Promise<number>{
	logger.info(`User (${userid}) removing feed ${feedid}`)

	let remArticles = await Article.deleteMany({userid:userid,feedid:feedid}).exec();
	await Feed.deleteMany({userid:userid,_id:feedid});
	logger.debug(`${userid} Removed feed:${feedid} containing ${remArticles?.n || remArticles?.deletedCount} articles`)
	return remArticles?.n || remArticles?.deletedCount;
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

export {
	fetchFeed,
	removeFeed,
	getFeedInfo,
	refreshAll
}
