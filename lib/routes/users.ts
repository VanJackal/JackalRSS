import express = require('express');
import passport = require('passport');
import {User} from 'jrss-db';
import {logger} from 'logging'

const router = express.Router();

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post('/login', passport.authenticate('local'), (req, res) => {
    logger.trace("users/login called")
    req.logIn(req.user, (err) => {
        if (err) {
            logger.warn(`Error in login process for ${req.user}:\n` + err);
            return res.json({ message: err })
        }
        logger.info(`User (${req.user.username}) logged in.`)
        res.json({ message: `Logged in as ${req.user.username}` });
    })
})

router.post('/logout', (req, res) => {
    logger.trace("users/logout called")
    console.log(req)
    let msg = `Logged out ${req.user?.username || "[Not Logged In]"}`;
    if (req.user) logger.info(`${req.user?.username} logged out`);
    req.logout();
    res.json({ message: msg })
})

router.post('/register', async (req, res) => {
    logger.trace("users/register called")
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
        res.status(409)
        logger.warn(`Duplicate user creation attempted (${username})`)
        res.json({message:`User ${username} already exists`})
    } else {
        const user = new User({ username: username });
        await user.setPassword(password);
        await user.save();
        logger.info(`User (${username}) created`)
        res.status(200)
        res.json({message:`User ${username} created`})
    }
})

module.exports = router;
