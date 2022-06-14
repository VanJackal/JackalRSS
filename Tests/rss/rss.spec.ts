//This test file requires a server @ the address stored in process.env.FEEDS_HOST (in particular <FEEDS_HOST>/feeds/[feed0.xml,feed1.xml])
import * as mongoose from 'mongoose'
import {Feed, init} from 'jrss-db'
import * as assert from 'assert'
import * as rss from 'rss-handler'

//todo update this file to use an actual user (should use the api libraries)
const USERID = "000000000000";//should not actually point to something

before(async () => {
    init()

    await Feed.create({
        title:"Feed0",
        description:"RSS Test Feed",
        link:`${process.env.FEEDS_HOST}/feed0.xml`,
        userid:USERID
    })

    await Feed.create({
        title:"Feed1",
        description:"Atom Test Feed",
        link:`${process.env.FEEDS_HOST}/feed1.xml`,
        userid:USERID
    })
})

describe("RSS-Handler Tests", () => {
    it("should fetch 5 articles from the test feeds initially", async () => {
        let newArticles = await rss.refreshAll(USERID);
        assert(newArticles == 5)
    })
})

after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})