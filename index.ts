import express = require('express');
import session = require('express-session');
import passport = require('passport');
import {ArticlesRouter, FeedsRouter, UtilRouter} from 'routes'
import userRoutes = require('./lib/routes/users');
import {logger} from 'logging'
import 'jrss-db'//initializes mongoose

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

app.use('/api/articles', ArticlesRouter);
app.use('/api/feeds', FeedsRouter);
app.use('/api/util', UtilRouter);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    logger.error(err);
    next();
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});