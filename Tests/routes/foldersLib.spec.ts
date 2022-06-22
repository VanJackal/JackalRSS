import {Folder,IFolder,init} from "jrss-db";
import * as assert from "assert"
import {Types} from "mongoose";
import {getFolders} from "routes/foldersLib";

const USERID:Types.ObjectId = Types.ObjectId("000000000000000000000000");

before(()=>{
    init()
})

describe("foldersLib tests", ()=>{
    let sampleFolder:IFolder = {name: "TestFolder", shortName: "test", userid: USERID}
    describe("getFolders", ()=>{
        describe("test array lengths", async () => {
            let folder;
            let folders;
            it("should return length 0 initially", async () => {
                folders = await getFolders(USERID)
                assert(!folders || folders.length == 0)
            })
            it("should return 1 when when folder is added", async () => {
                folder = await Folder.create(sampleFolder);
                folders = await getFolders(USERID)
                assert(folders && folders.length == 1)
            })
            it("should return 0 if the folder is removed", async () => {
                await Folder.deleteOne({_id:folder._id});
                folders = await getFolders(USERID)
                assert(!folders || folders.length == 0)
            })
        })
    })

    describe("createFolder")
})