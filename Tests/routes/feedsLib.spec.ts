import * as lib from 'routes/feedsLib'
import * as assert from 'assert'
import {Document, Types} from "mongoose";
import {Article,Feed,IArticle, IFeed} from 'jrss-db'
import {FeedInitializer} from "routes/feedsLib";

const USERID:Types.ObjectId = Types.ObjectId("000000000000000000000000");

describe("feedsLib tests", () => {
    const sampleFeed:IFeed = {
        description: "sample description",
        link: "url",
        title: "sample title feedsLib",
        userid: USERID
    }
    const sampleFeedInit:FeedInitializer = {
        description: "sample desc",
        link: "url",
        title: "Sample Title"
    }
    describe("getFeedsUnread", () => {
        it("should return empty list if there are no feeds", async () => {
            assert((await lib.getFeedsUnread(USERID)).length == 0)
        })
        let feed:IFeed & Document;
        it("should return unread == 0 on empty list", async () => {
            feed = await Feed.create(sampleFeed)
            let unread = (await lib.getFeedsUnread(USERID))[0]
            assert(unread.unread == 0)
        })
        it("should have correct number of unread when articles are added",async () => {
            let article:IArticle = {
                description: "test description",
                feedid: feed._id,
                read: false,
                title: "Title",
                userid: USERID,
                uuid: "uuid"
            }
            await Article.create(article);
            article.read = true
            await Article.create(article);
            let unread = (await lib.getFeedsUnread(USERID))[0]
            assert(unread.unread == 1)
        })
    })
    describe("createFeed", () => {
        it("should return the new IFeed object on creation", async () => {
            let newFeed = await lib.createFeed(USERID,sampleFeedInit)
            assert(newFeed.title == sampleFeedInit.title)
        })
    })
    after(async () => {
        await Feed.deleteMany({userid:USERID})
    })
})