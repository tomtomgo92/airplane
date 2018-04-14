const { ObjectId } = require('mongodb');

/**
 * Returns a mongodb query object, seperated by a $and operator
 * @param {Array} queryList 
 */
function buildMongoQuery(queryList) {
    if (queryList.length > 1) {
        return {
            $and: queryList
        }
    }
    else {
        return queryList[0]
    }
}

/**
 * Returns an object with the coordinates of a 10km range around the input lat,lon coordinates
 * @param {String} coords 
 */
function parseRange(coords) {
    if (coords) {
        let latlon = coords.split(",");
        let latRange = [parseFloat(latlon[0]) - 0.5, parseFloat(latlon[0]) + 0.5];
        let lonRange = [parseFloat(latlon[1]) - 0.5, parseFloat(latlon[1]) + 0.5];

        return {
            lat: {
                $gt: latRange[0],
                $lt: latRange[1]
            },
            lon: {
                $gt: lonRange[0],
                $lt: lonRange[1]
            }
        }
    }
}

module.exports = airports = {
    /**
     * Handles the /airport route
     * Returns all airports as an Array when no parameters are provided
     * 
     * limit=n      limits the number of responses to n
     * country=s    queries the db by country 
     * city=s       queries the db by city
     * range=n      checks if the given position (lat,lon) is close to an airport (10km radius)
     */
    getAirports(req, res) {
        const queries = [
            { country: req.query.country },
            { city: req.query.city },
            { lat: req.query.range ? parseRange(req.query.range).lat : null },
            { lon: req.query.range ? parseRange(req.query.range).lon : null }
        ];

        let userQueries = queries.filter(queryObject => queryObject[Object.keys(queryObject)[0]] != undefined);
        console.log(buildMongoQuery(userQueries));

        req.app.locals.db.db('heroku_8618v047').collection("airports").find(buildMongoQuery(userQueries)).limit(parseInt(req.query.limit)).toArray(function (err, result) {
            if (err) throw err;
            res.json(result)
        })
    },

    /**
     * Handles the /airport/:id route
     * Returns the airport corresponding to the given /airport/:id
     */
    getAirportId(req, res) {
        req.app.locals.db.db('heroku_8618v047').collection("airports").find({ _id: ObjectId(req.params.airportId) }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result)
        })
    }
}