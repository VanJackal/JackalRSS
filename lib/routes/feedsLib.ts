import {Feed, IFeed} from "jrss-db";
import {Types} from 'mongoose'

type FeedUnread = {
    _id:Types.ObjectId,
    title:string,
    folderid?:Types.ObjectId,
    unread:number
}

async function getFeeds(userid:Types.ObjectId):FeedUnread[]{

}

export {

}