import {Types} from 'mongoose'
import {logger} from 'logging'
import {type FeedUnread, getFeedsUnread} from "./feedsLib";
import {getFolders} from "./foldersLib";
import {IFolder} from "jrss-db";

type Sidebar = {
    folders:IFolder[],
    feeds:FeedUnread[]
}

/**
 * get the children of folderId in the sidebar (folders and feeds)
 * @param userid id of the user to get
 * @param folderId id of the parent folder
 */
async function getSidebar(userid:Types.ObjectId, folderId:Types.ObjectId):Promise<Sidebar> {
    logger.debug(`${userid} Getting sidebar`)
    const foldersP = getFolders(userid, folderId)
    const feedsP = getFeedsUnread(userid, folderId)

    return {
        folders: await foldersP,
        feeds: await feedsP
    };
}


export {
    getSidebar
}