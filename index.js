const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const routes = require('./lib/routes/api');
const userRoutes = require('./lib/routes/users');

const app = express();

const port = process.env.PORT || 5000;


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials","true")
    next();
});

app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize({}));
app.use(passport.session({}));

app.use('/api', routes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});