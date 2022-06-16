import express = require('express');
import passport = require('passport');
import {User} from 'jrss-db';
import {logger} from 'logging'

const router = express.Router();

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post('/login', passport.authenticate('local'), (req, res) => {
    req.logIn(req.user, (err) => {
        if (err) {
            return res.json({ message: err })
        }

        res.json({ message: `Logged in as ${req.user.username}` });
    })
})

router.post('/logout', (req, res) => {
    console.log(req)
    let msg = `Logged out ${req.user?.username || "[Not Logged In]"}`;
    req.logout();
    res.json({ message: msg })
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
        res.status(409)
        res.json({message:`User ${username} already exists`})
    } else {
        const user = new User({ username: username });
        await user.setPassword(password);
        await user.save();
        res.status(200)
        res.json({message:`User ${username} created`})
    }
})

module.exports = router;
