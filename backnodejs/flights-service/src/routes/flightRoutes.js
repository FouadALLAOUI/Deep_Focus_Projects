const { Router } = require('express');
const { getLiveFlights, getAircraft, getArrivals, getDepartures } = require('../controllers/flightController');

const router = Router();

router.get('/live', getLiveFlights);
router.get('/aircraft/:icao24', getAircraft);
router.get('/airport/:icao/arrivals', getArrivals);
router.get('/airport/:icao/departures', getDepartures);

module.exports = router;
