import {Types} from "mongoose";
import {Article, IArticle} from "jrss-db";
import {logger} from 'logging'

async function getArticleFromId(articleID:Types.ObjectId, userID:Types.ObjectId):Promise<IArticle> {
    logger.debug(`User(${userID}) getting Article id: ${articleID}`)
    return Article.findOne({_id: articleID, userid:userID});
}

async function patchArticleFromId(articleID:Types.ObjectId, userID:Types.ObjectId, changes:Partial<IArticle>):Promise<IArticle>{
    logger.debug(`User(${userID}) patching ${articleID} with ${changes}`)
    return Article.findOneAndUpdate({userid:userID,_id:articleID},changes)
}

async function deleteArticleFromId(articleID:Types.ObjectId, userID:Types.ObjectId):Promise<IArticle> {
    return Article.findOneAndDelete({_id:articleID,userid:userID})
}

export {
    getArticleFromId,
    patchArticleFromId,
    deleteArticleFromId
}