import {isValidObjectId} from "mongoose";
import {logger} from 'logging'

function requireAuth(req, res, next) {
    if (!req.user && isValidObjectId(req.user._id)){
        logger.trace(`401 Unauthorized @ ${req.originalUrl}`)
        return res.sendStatus(401);
    } else {
        next()
    }
}

export {
    requireAuth
}