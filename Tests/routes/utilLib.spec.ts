import * as assert from "assert"
import {Types} from "mongoose";
import {Feed, Folder, IFeed, IFolder} from "jrss-db";
import {getSidebar} from "routes/utilLib"

const USERID:Types.ObjectId = Types.ObjectId("000000000000000000000000");

describe("Util Tests",() => {
    let sampleFeed:IFeed;
    let sampleFolder:IFolder;
    let sampleFolder1:IFolder;
    describe("getSidebar Tests", () => {
        it("return falsy for empty db", async () => {
            assert(!(await getSidebar(USERID))?.length)
        })
        it("should truthy for db with items", async () => {
            sampleFolder = {name: "folder", userid: USERID}
            let folderId = (await Folder.create(sampleFolder))._id;
            sampleFeed = {description: "desc", link: "http", title: "title", userid: USERID}
            await Feed.create(sampleFeed);

            sampleFeed["folderid"] = folderId
            sampleFolder1 = {name: "folder1", userid: USERID, parent:folderId}
            await Feed.create(sampleFeed)
            await Folder.create(sampleFolder1)

            assert((await getSidebar(USERID))?.length)
        })
        it("should return a tree of SidebarItem's")
    })
    after(() => {
        Feed.deleteMany({});
        Folder.deleteMany({});
    })
})