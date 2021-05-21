const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
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
	pubDate:{
		type: Date,
		default: Date.now
	},
	link:{
		type: String
	},
	enclosure:{
		type: String
	},
	content:{
		type: String
	}
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;