import {Types} from 'mongoose'
import {logger} from 'logging'
import {type FeedUnread, getFeedsUnread} from "./feedsLib";
import {getFolders} from "./foldersLib";
import {IFolder} from "jrss-db";

type Sidebar = {
    folders:IFolder[],
    feeds:FeedUnread[]
}

async function getSidebar(userid:Types.ObjectId):Promise<Sidebar> {
    logger.debug(`${userid} Getting sidebar`)
    const foldersP = getFolders(userid)
    const feedsP = getFeedsUnread(userid)

    return {
        folders: await foldersP,
        feeds: await feedsP
    };
}


export {
    getSidebar
}