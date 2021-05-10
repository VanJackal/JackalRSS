const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({

});

const Feed = mongoose.model('article', FeedSchema);

module.exports = Feed;
