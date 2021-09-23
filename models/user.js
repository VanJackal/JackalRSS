const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
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

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('user',UserSchema);

module.exports = User;