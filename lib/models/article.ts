import {model , Schema, Types} from "mongoose"

interface IArticle {
	feedid:Types.ObjectId,
	title:string,
	description:string,
	pubDate:Date,
	link?:string,
	enclosure?:object,
	content?:string,
	uuid:string,
	read:boolean,
	userid:Types.ObjectId
}

const ArticleSchema = new Schema<IArticle>({
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
		default: new Date()
	},
	link:{
		type: String
	},
	enclosure:{
		type: Object
	},
	content:{
		type: String
	},
	uuid:{
		type:String,
		required: true
	},
	read:{
		type:Boolean,
		required:true
	},
	userid:{
		type: String,
		required: true
	}
});

const Article = model<IArticle>('article', ArticleSchema);

export {
	Article,
	IArticle
};
