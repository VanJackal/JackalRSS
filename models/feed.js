const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
	feedid:{
		type: String,
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
	},
	userid:{
		type: String,
		required: true
	},
	folder:{
		type: String
	}
});

const Feed = mongoose.model('feed', FeedSchema);

module.exports = Feed;
