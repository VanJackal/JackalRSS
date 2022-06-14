import {model , Schema, Types} from "mongoose"
import {IGenericDoc} from "./index";

interface IFeed extends IGenericDoc{
	_id?:Types.ObjectId,
	shortTitle?:string,
	title:string,
	description:string,
	link:string,
	userid:Types.ObjectId,
	folderid?:Types.ObjectId
}

const FeedSchema = new Schema<IFeed>({
	shortTitle:{
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
		type: Schema.Types.ObjectId,
		required: true
	},
	folderid:{
		type: Schema.Types.ObjectId
	}
});

const Feed = model<IFeed>('feed', FeedSchema);

export {
	Feed,
	IFeed
};
