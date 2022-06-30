import {isValidObjectId} from "mongoose";
import {logger} from 'logging'

function requireAuth(req, res, next) {
    if(req.method === "OPTIONS") {
        next(); // dont require auth for preflight
        return
    }

    if (!req.user && isValidObjectId(req.user?._id)){
        logger.trace(`401 Unauthorized @ ${req.method} ${req.originalUrl}`)
        return res.sendStatus(401);
    } else {
        next()
    }
}

export {
    requireAuth
}