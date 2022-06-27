import {Article, Feed} from "jrss-db";
import {Types} from 'mongoose'
import {logger} from 'logging'

type FeedUnread = {
    _id:Types.ObjectId,
    title:string,
    shortTitle?:string,
    folderid?:Types.ObjectId,
    unread:number
}

async function getFeedsUnread(userid:Types.ObjectId):Promise<FeedUnread[]>{
    let feedsData = await Feed.find({ userid: userid }, { _id: 1, title: 1, folderid: 1, shortTitle:1 }).exec()
    const numUnread = await getUnread(userid)

    logger.debug(`${userid} getting unread feeds:\n\t\t` + JSON.stringify(numUnread))

    return feedsData.map((feed) => {
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
    getFeedsUnread
}