import express = require('express')
import {isValidObjectId} from "mongoose";
import {logger} from 'logging'
import * as lib from './articlesLib'

const router = express.Router()

// ROUTES
/**
 * handle verification and ensure id param and userid are valid
 */
router.all('/:id', (req,res,next) => {
    if (!req.user) return res.sendStatus(401);
    if (!(isValidObjectId(req.params.id) && isValidObjectId(req.user._id))) {
        logger.trace(`GET articles/:id invalid userid(${req.user._id}) or articleid(${req.params.id})`)
        res.message = "Invalid Userid or articleId"
        return res.sendStatus(400);
    }
    next()
})

router.get('/:id', async (req, res) => { // Gets full info of the article with the given id
    let article = await lib.getArticleFromId(req.params.id, req.user._id);
    res.json(article)
});

router.patch('/:id', async (req, res) => { // sets the readstate of the article with the given id (can also be used to update an entry)
    let patched = await lib.patchArticleFromId(req.params.id,req.user._id,req.body)
    res.json(patched);
});

router.delete('/:id', (req, res) => {// Delete article entry by id
    let deleted = lib.deleteArticleFromId(req.params.id, req.user._id)
    res.json(deleted)
});

export {
    router,
    lib
}