const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post('/login',passport.authenticate('local'),(req,res) => {
    req.logIn(req.user, (err) => {
        if(err){
            return res.json({message:err})
        }

        res.json({message:`Logged in as ${req.user.username}`});
    })
})

router.post('/logout', (req, res) => {
    console.log(req)
    let msg = `Logged out ${req.user?.username || "[Not Logged In]"}`;
    req.logout();
    res.json({message:msg})
})

module.exports = router;
