import * as aLib from 'routes/articlesLib'
import * as assert from 'assert'
import {Types} from 'mongoose'
import {Article, IArticle, init} from 'jrss-db'

const USERID:Types.ObjectId = Types.ObjectId("000000000000000000000000");

before( ()=>{
    init()
})

describe("ArticlesLib Testing", () => {
    let articleid:Types.ObjectId;
    before(async ()=>{
        let article:IArticle = {
            description: "description",
            feedid: USERID,
            read: false,
            title: "title",
            userid: USERID,
            uuid: "uuid"
        }
        articleid = (await Article.create(article))._id;
    })

    describe("getArticleFromId Tests", () =>{
        it("should get an existing article", async () => {
            assert( await aLib.getArticleFromId(articleid,USERID) );
        })
        it("should return falsy if no article is found", async () => {
            assert(!(await aLib.getArticleFromId(USERID,USERID)))
        })
    })
    describe("patchArticleFromId Tests", () => {
        let updated:IArticle;
        before(async ()=>{
            updated = await aLib.patchArticleFromId(articleid,USERID,{read:true});
        })
        it("should update the article with new data",async () => {
            let article = await aLib.getArticleFromId(articleid,USERID);
            assert(article.read === true)
        })
        it("should return truthy on success", () => {
            assert(updated)
        })
        it("should return falsy on failure", async () => {
            assert(!(await aLib.patchArticleFromId(USERID,USERID,{read:true})))
        })
    })

    describe("deleteArticleFromId Tests", () => {
        it("should return truthy on success", async() =>{
            assert(await aLib.deleteArticleFromId(articleid,USERID))
        })
        it("should return falsy on failure", async () =>{
            assert(!(await aLib.deleteArticleFromId(articleid,USERID)))
        })
    })

})