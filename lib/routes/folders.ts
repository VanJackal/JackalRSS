import {IFolder} from "jrss-db";
import * as lib from './foldersLib'
import express = require('express')

const router = express.Router();

//add auth to all routes and subroutes of /folders
router.all("/(.*)", (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    next();
})

router.get("/", async (req,res) => {
    let folders:IFolder[] = await lib.getFolders(req.user._id);
    res.json(folders);
    res.status(200);
})

router.post("/", async (req,res) => {
    let newFolder:IFolder = await lib.createFolder(req.user._id,req.body.json)
    res.status(201)
    res.json(newFolder)
})

router.get("/:folderid", async (req,res) => {
    let folder:IFolder = await lib.getFolder(req.user._id,req.params.folderid)
    res.json(folder)
})
router.patch("/:folderid", async (req,res) => {
    let patched:IFolder = await lib.patchFolder(req.user._id,req.params.folderid,req.body.json);
    res.json(patched)
})
router.delete("/:folderid", async (req,res) => {
    let deleted:IFolder = await lib.deleteFolder(req.user._id, req.params.folderid)
    res.json(deleted)
})

export {router}
