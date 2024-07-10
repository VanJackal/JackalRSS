import {Article, Feed, IArticle, IFeed} from "jrss-db";
import {Types} from 'mongoose'
import {logger} from 'logging'

export type FeedUnread = {
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

//todo rewrite this to use an aggregate
async function getFeedsUnread(userid:Types.ObjectId, folderId=null):Promise<FeedUnread[]>{
    const numUnread = await Feed.aggregate([
        {$match:{userid:userid, folderid:folderId}},
        {$lookup:{
                from: "articles",
                let:{feed:"$_id"},
                pipeline:[{
                    $match:{$expr:{
                        $and:[
                            {$eq:["$userid", userid]},
                            {$eq:["$$feed","$feedid"]},
                            {$eq:["$read", false]}
                        ]
                        }}
                }],
                as:"unreadArticles"
            }},//left join matching articles
        {$project:{
                _id:1,
                unread:{$size:"$unreadArticles"},
                title:1,
                shortTitle:1,
                folderid:1
            }} // count number of unread articles and project the correct fields
    ])

    logger.debug(`${userid} getting unread feeds:\n\t\t` + JSON.stringify(numUnread))

    logger.trace(JSON.stringify(`${userid} Got FeedUnreads: \n\t\t${JSON.stringify(numUnread)}`))
    return numUnread
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

export {
    FeedInitializer,
    getFeedsUnread,
    createFeed,
    patchFeed,
    getFeed,
    getFeedArticles
}