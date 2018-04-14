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
MongoClient.connect("mongodb://heroku_8618v047:s1s95q848cfnk2gi07ksuri2ov@ds119018.mlab.com:19018/heroku_8618v047", (err, db) => {
    if (err) throw err;

    app.locals.db = db;
    app.listen(process.env.PORT || 3000);
});