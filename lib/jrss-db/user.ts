import {model, Schema} from "mongoose"
import * as passport from 'passport-local-mongoose'
import {IGenericDoc} from "./index";

interface IUser extends IGenericDoc{
    username:string,
    salt:string,
    hash:string
}

const UserSchema = new Schema<IUser>({
    username:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
    hash:{
        type:String,
        required: true
    }
})

UserSchema.plugin(passport);
const User = model<IUser>('user',UserSchema);

export {
    User,
    IUser
};