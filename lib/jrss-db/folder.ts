import {model, Schema, Types} from "mongoose"

interface IFolder{
    userid:Types.ObjectId,
    name:string,
    shortName?:string,
    parent?:Types.ObjectId
}

const FolderSchema = new Schema<IFolder>({
    userid:{
        type:Schema.Types.ObjectId,
        required:true
    },
    name:{
        type: String,
        required: true
    },
    shortName:{
        type: String
    },
    parent:{
        type: Schema.Types.ObjectId,
        required: false
    }
});

const Folder = model<IFolder>('folder', FolderSchema);

export {
    Folder,
    IFolder
};