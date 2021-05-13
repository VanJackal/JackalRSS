const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:{
        type: String,
        required: [true, 'Title of the article is required']
    }
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;
