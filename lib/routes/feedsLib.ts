import {Article, Feed, IArticle, IFeed} from "jrss-db";
import {Types} from 'mongoose'
import {logger} from 'logging'

type FeedUnread = {
    _id:Types.ObjectId,
    title:string,
    shortTitle?:string,
    folderid?:Types.ObjectId,
    unread:number
}

type FeedInitializer = Omit<IFeed,"userid">

async function createFeed(userid:Types.ObjectId, newFeed:FeedInitializer):Promise<IFeed> {
    logger.debug(`${userid} creating new feed, url: ${newFeed.link}`)
    logger.trace(`${userid} create new feed: \n\t\t${JSON.stringify(newFeed)}`)
    return Feed.create({userid:userid, ...newFeed})
}

async function getFeedsUnread(userid:Types.ObjectId):Promise<FeedUnread[]>{
    let feedsData = await Feed.find({ userid: userid }, { _id: 1, title: 1, folderid: 1, shortTitle:1 }).exec()
    const numUnread = await getUnread(userid)

    logger.debug(`${userid} getting unread feeds:\n\t\t` + JSON.stringify(numUnread))

    let feeds = feedsData.map((feed) => {
        let unread:{_id:Types.ObjectId,count:number} = numUnread.find((feedUnread) => {
            return feed._id.equals(feedUnread._id)
        })
        logger.trace(`${userid} unread for feed-${feed._id}: ${JSON.stringify(unread)}`)

        return {//using ...feed creates unwanted results
            _id:feed._id,
            unread:unread?.count || 0,
            title: feed.title,
            shortTitle:feed.shortTitle,
            folderid:feed.folderid,
        }
    })
    logger.trace(JSON.stringify(`${userid} Got FeedUnreads: \n\t\t${JSON.stringify(feeds)}`))
    return feeds
}

async function patchFeed(userid:Types.ObjectId, feedid:Types.ObjectId, changes:Partial<IFeed>):Promise<IFeed> {
    logger.debug(`${userid} patching feed(${feedid})`)
    logger.trace(`${userid} patching feed(${feedid}) with:\n\t\t${JSON.stringify(changes)}`)
    return Feed.findOneAndUpdate({ _id: feedid, userid: userid }, changes)
}

async function getFeed(userid:Types.ObjectId, feedid:Types.ObjectId):Promise<IFeed>{
    logger.debug(`${userid} getting feed: ${feedid}`)
    return Feed.findOne({_id:feedid, userid:userid})
}

async function getFeedArticles(userid:Types.ObjectId, feedid:Types.ObjectId):Promise<Partial<IArticle>[]> {
    logger.debug(`${userid} getting article details for ${feedid}`)
    return Article.find({ feedid: feedid, userid: userid}, { title: 1, pubDate: 1, read: 1 })
}

async function getUnread(userid:Types.ObjectId) {
    return Article.aggregate([
        {
            "$match": { userid: userid, read: false }
        },
        {
            "$group": {
                _id: "$feedid",
                count: { "$sum": 1 }
            }
        }
    ]);
}

export {
    FeedInitializer,
    getFeedsUnread,
    createFeed,
    patchFeed,
    getFeed,
    getFeedArticles
}