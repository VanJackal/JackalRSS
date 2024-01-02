import {Folder, IFolder} from "jrss-db";
import * as assert from "assert"
import {Types} from "mongoose";
import {createFolder, getFolders, getFolder, deleteFolder, patchFolder} from "routes/foldersLib";

const USERID:Types.ObjectId = Types.ObjectId("000000000000000000000000");

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
    describe("createFolder", () => {
        it("should return the folder object on creation", async () => {
            let newFolder = await createFolder(sampleFolder.userid,sampleFolder.name,
                sampleFolder.shortName,sampleFolder.parent);
            assert(newFolder.name == sampleFolder.name)
        })
    })
    describe("deleteFolder",() => {
        let folder;
        before(async () => {
            folder = await Folder.create(sampleFolder);
        })
        it("should return falsy on failure to delete", async () => {
            assert(!(await deleteFolder(USERID,USERID)))
        })
        it("should return the deleted article on success", async () => {
            let deleted:IFolder = await deleteFolder(USERID, folder._id)
            console.log(deleted)
            assert(deleted.name === sampleFolder.name)
        })
    })
    describe("patchFolder", () => {
        let folder;
        before(async () => {
            folder = await Folder.create(sampleFolder);
        })
        it("should return falsy on failure", async () => {
            assert(!(await patchFolder(USERID,USERID,{name:"not a name"})))
        })
        it("should return the updated folder on success", async () => {
            let updated = await patchFolder(USERID, folder._id, {name: "newName"})
            console.log(updated)
            assert(updated.name === sampleFolder.name)
            updated = await getFolder(USERID,folder._id);
            assert(updated.name === "newName")
        })
    })
    describe("getFolder", () => {
        let folder;
        before(async () => {
            folder = await Folder.create(sampleFolder);
        })
        it("should return falsy if the folder is not found", async () => {
            assert(!(await getFolder(USERID,USERID)))
        })
        it("should return the folder if it exists", async () => {
            let found:IFolder = await getFolder(USERID, folder._id);
            assert(found)
            assert(found.name == sampleFolder.name)
        })
    })
    after(async () => {
        await Folder.deleteMany({userid:USERID})
    })
})