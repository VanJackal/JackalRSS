import {Article, IArticle} from './article'
import {Feed, IFeed} from './feed'
import {Folder, IFolder} from './folder'
import {User, IUser} from './user'
import * as mongoose from "mongoose";
import {logger} from 'logging'

function init():void {
    mongoose.connect(process.env.DB, {useNewUrlParser: true,useFindAndModify: false,useUnifiedTopology: true}, (err)=>{
        if (err){
            logger.fatal("DB failed to connect!")
            logger.fatal(err);
        } else {
            logger.info("Database Connected");
        }
    })
}
init();

export {
    Article,
    Feed,
    Folder,
    User,
    IArticle,
    IFeed,
    IUser,
    IFolder,
    init
}
