import {Feed, Folder} from "jrss-db";
import {Types} from 'mongoose'
import {logger} from 'logging'

type SidebarItem = {
    _id:Types.ObjectId,
    type:string,
    name:string,
    shortName?:string,
    children?:SidebarItem[]
}

async function getSidebar(userid:Types.ObjectId):Promise<SidebarItem[]> {
    logger.debug(`${userid} Getting sidebar`)
    let items = []
    let feeds = await Feed.find({userid:userid},{_id:1, title:1, folderid:1, shortTitle:1}).exec()
    let folders = await Folder.find({userid:userid}, {name:1, shortName:1, _id:1, parent:1}).exec()
    let topLevel:SidebarItem[] = []
    //map feed values to sidebarItem type
    feeds.forEach((feed) => {
        let item = {
            _id:feed._id,
            name:feed.title,
            shortName:feed.shortTitle,
            parent:feed.folderid,
            type:"feed",
            children:[]
        }
        if (item.parent) {
            items.push(item)
        } else {
            delete item.parent
            items.push(item)
            topLevel.push(item)
        }
    })
    folders.forEach((folder) => {
        let item = {
            _id:folder._id,
            name:folder.name,
            shortName:folder.shortName,
            parent:folder.parent,
            type:"folder",
            children:[]
        }
        if (folder.parent) {
            items.push(item)
        } else {
            delete item.parent
            items.push(item)
            topLevel.push(item)
        }
    })

    items.forEach((item) => {
        if(item.parent){
            let parent = items.find((parentItem) => {
                return parentItem._id.equals(item.parent)
            })
            delete item.parent
            parent.children.push(item);
        }
    })

    console.log(topLevel)

    return topLevel;
}

export {
    getSidebar
}