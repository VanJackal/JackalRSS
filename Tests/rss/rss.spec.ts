//This test file requires a server @ the address stored in process.env.FEEDS_HOST (in particular <FEEDS_HOST>/[feed0.xml,feed1.xml])
import * as mongoose from 'mongoose'
import {Article, Feed, init} from 'jrss-db'
import * as assert from 'assert'
import * as rss from 'rss-handler'

//todo update this file to use an actual user (should use the api libraries)
const USERID = "000000000000000000000000";//should not actually point to something

before(() => {
    init()
})

describe("RSS-Handler Tests", async () => {
    let feed0id;
    let feed1id;
    before(async () => {
        feed0id = (await Feed.create({//feed will contain 3 articles
            title: "Feed0",
            description: "RSS Test Feed",
            link: `${process.env.FEEDS_HOST}/feed0.xml`,
            userid: USERID
        }))._id
        feed1id = (await Feed.create({//feed will contain 2 articles
            title: "Feed1",
            description: "Atom Test Feed",
            link: `${process.env.FEEDS_HOST}/feed1.xml`,
            userid: USERID
        }))._id
    })

    it("should fetch 5 articles from the test feeds initially", async () => {
        let newArticles = await rss.refreshAll(USERID);
        assert(newArticles == 5)
    })
    it("should fetch 0 articles if there are no new articles", async () => {
        await rss.refreshAll(USERID)
        assert(await rss.refreshAll(USERID) == 0);
    })
    it("should fetch 1 article from a feed with one new article", async () => {
        await Article.deleteOne({userid:USERID, feedid:feed0id})
        assert(await rss.fetchFeed(feed0id,USERID) == 1)
    })

    it("should return correct number of deleted articles", async () => {
        await rss.refreshAll(USERID)
        assert(await rss.removeFeed(feed0id, USERID) == 3)
        assert(await rss.removeFeed(feed1id, USERID) == 2)
    })
    it("should add no articles if there are no feeds", async () => {
        assert(await rss.refreshAll(USERID) == 0);
    })

    it("should fetch title and description from remote url", async () => {
        let feed0info = await rss.getFeedInfo(process.env.FEEDS_HOST + "/feed0.xml");
        let feed1info = await rss.getFeedInfo(process.env.FEEDS_HOST + "/feed1.xml");
        assert(feed0info.title && feed0info.description)
        assert(feed1info.title && feed1info.description)
    })
    it("should return falsy if the feed doesnt exist at the url")
})

after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})