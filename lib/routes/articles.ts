import express = require('express')
import {isValidObjectId} from "mongoose";
import {logger} from 'logging'
import * as lib from './articlesLib'
import {requireAuth} from "./middleware";

const router = express.Router()

/**
 * handle verification and ensure id param and userid are valid
 */
router.all('/:id',requireAuth, (req,res,next) => {
    //check if the ids are valid send 400 if not
    if (!(isValidObjectId(req.params.id))) {
        logger.trace(`articles/:id invalid articleid(${req.params.id})`)
        res.json({
            message:"Invalid articleId"
        })
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