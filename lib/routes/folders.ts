import {Folder, IFolder} from "jrss-db";
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
    req.json(folders);
    req.status(200);
})

router.post("/", (req,res) => {

})

router.get("/:folderid", (req,res) => {

})
router.patch("/:folderid", (req,res) => {

})
router.delete("/:folderid", (req,res) => {

})

export {router}
