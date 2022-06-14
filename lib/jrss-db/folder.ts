import {model, Schema} from "mongoose"
import {IGenericDoc} from "./index";

interface IFolder extends IGenericDoc{
    name:string,
    shortName?:string,
    parent:string
}

const FolderSchema = new Schema<IFolder>({
    name:{
        type: String,
        required: true
    },
    shortName:{
        type: String
    },
    parent:{
        type: String,
        required: true
    }
});

const Folder = model<IFolder>('folder', FolderSchema);

export {
    Folder,
    IFolder
};