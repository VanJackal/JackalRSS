const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
	feedid:{
		type: String,
		required: true
	},
	title:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	link:{
		type: String,
		required: true
	}
});

const Feed = mongoose.model('article', FeedSchema);

module.exports = Feed;
