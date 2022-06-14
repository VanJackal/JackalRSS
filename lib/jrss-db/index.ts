import {Article, IArticle} from './article'
import {Feed, IFeed} from './feed'
import {Folder, IFolder} from './folder'
import {User, IUser} from './user'
import * as mongoose from "mongoose";

function init():void {
    mongoose.connect(process.env.DB, {useNewUrlParser: true,useFindAndModify: false,useUnifiedTopology: true})
        .then(() => console.log('Database Connected.'))
        .catch(err => console.log(err));
}

init()

export {
    Article,
    Feed,
    Folder,
    User,
    IArticle,
    IFeed,
    IUser,
    IFolder
}
