const routes = require('express').Router();
const airportController = require('../controllers/airports');

routes.get('/airports', airportController.getAirports);
routes.get('/airports/:airportId', airportController.getAirportId);

module.exports = routes;
