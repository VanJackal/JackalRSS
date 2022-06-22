import {Folder, IFolder} from "jrss-db";
import {Types} from 'mongoose'

async function getFolders(userid):Promise<IFolder[]>{
    return Folder.find({userid:userid})
}

async function createFolder(userid:Types.ObjectId, name:string, shortName:string = null, parent:Types.ObjectId = null): Promise<IFolder> {
    let folder:IFolder = {name: name, parent: parent, shortName: shortName, userid: userid}
    return Folder.create(folder)
}

export {
    getFolders
}