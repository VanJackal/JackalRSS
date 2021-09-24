const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const routes = require('./routes/api');
const userRoutes = require('./routes/users');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB, {useNewUrlParser: true,useFindAndModify: false,useUnifiedTopology: true})
    .then(() => console.log('Database Connected.'))
    .catch(err => console.log(err));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});
app.use(cors())

app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});