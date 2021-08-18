const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/api')
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB, {useNewUrlParser: true,useFindAndModify: false,useUnifiedTopology: true})
    .then(() => console.log('Database Connected.'))
    .catch(err => console.log(err));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());

app.use('/', routes);

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});