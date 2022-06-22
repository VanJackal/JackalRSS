import {Folder, IFolder} from "jrss-db";
import {Types} from 'mongoose'
import {logger} from 'logging'

async function getFolders(userid):Promise<IFolder[]>{
    logger.trace(`Getting folders for ${userid}`)
    return Folder.find({userid:userid})
}

async function createFolder(userid:Types.ObjectId, name:string, shortName:string = null, parent:Types.ObjectId = null): Promise<IFolder> {
    let folder:IFolder = {name: name, parent: parent, shortName: shortName, userid: userid}
    logger.debug(`${userid} create new folder ${name}`)
    return Folder.create(folder)
}

async function deleteFolder(userid:Types.ObjectId, folderid:Types.ObjectId) {
    logger.debug(`(${userid}) attempting to delete ${folderid}`)
    return Folder.findOneAndDelete({userid:userid, _id:folderid})
}

async function getFolder(userid:Types.ObjectId, folderid:Types.ObjectId) {
    logger.debug(`${userid} getting ${folderid}`)
    return Folder.findOne({userid:userid, _id:folderid})
}

async function patchFolder(userid:Types.ObjectId, folderid:Types.ObjectId, changes:Partial<IFolder>):Promise<IFolder>{
    logger.debug(`User(${userid}) patching ${folderid} with ${changes}`)
    return Folder.findOneAndUpdate({userid:userid,_id:folderid},changes)
}//todo changes for this functions and any patch functions should check that the changes are acceptable (not changing the id of the folder)

export {
    getFolder,
    getFolders,
    createFolder,
    deleteFolder,
    patchFolder
}