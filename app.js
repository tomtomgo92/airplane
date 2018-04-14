const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const routes = require('./app/routes');

app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  
app.use('/', routes);


/**
 * Init the database connection and start the server
 */
MongoClient.connect("mongodb://test:testt@ds157964.mlab.com:57964/heroku_g91p4qtv", (err, db) => {
    if (err) throw err;

    app.locals.db = db;
    app.listen(process.env.PORT || 3001);
});