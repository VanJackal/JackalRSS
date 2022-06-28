import {IFolder} from "jrss-db";
import * as lib from './foldersLib'
import express = require('express')
import {requireAuth} from "./middleware";
import {isValidObjectId} from "mongoose";
import {logger} from 'logging'

const router = express.Router();

//add auth to all routes and subroutes of /folders
router.all("/*", requireAuth)

// folders/
router.get("/", async (req,res) => {
    let folders:IFolder[] = await lib.getFolders(req.user._id);
    res.json(folders);
    res.status(200);
})

router.post("/", async (req,res) => {
    let newFolder:IFolder = await lib.createFolder(req.user._id,req.body)
    res.status(201)
    res.json(newFolder)
})

// folders/:folderid
router.all("/:folderid",(req,res,next) => {
    if(isValidObjectId(req.params.folderid)){
        next()
    } else {
        logger.trace("Invalid Folderid @ " + req.originalUrl)
        res.status(400)
        return
    }
})
router.get("/:folderid", async (req,res) => {
    let folder:IFolder = await lib.getFolder(req.user._id,req.params.folderid)
    res.json(folder)
})
router.patch("/:folderid", async (req,res) => {
    let patched:IFolder = await lib.patchFolder(req.user._id,req.params.folderid,req.body);
    res.json(patched)
})
router.delete("/:folderid", async (req,res) => {
    let deleted:IFolder = await lib.deleteFolder(req.user._id, req.params.folderid)
    res.json(deleted)
})

export {router}
