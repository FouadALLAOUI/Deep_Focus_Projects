const flightService = require('../services/flightService');

const getLiveFlights = async (req, res, next) => {
  try {
    const { lamin, lomin, lamax, lomax } = req.query;
    const bbox = lamin && lomin && lamax && lomax ? { lamin, lomin, lamax, lomax } : {};
    const result = await flightService.getLiveFlights(bbox);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getAircraft = async (req, res, next) => {
  try {
    const { icao24 } = req.params;
    const aircraft = await flightService.getAircraftState(icao24.toLowerCase());
    res.json({ success: true, data: aircraft });
  } catch (err) {
    next(err);
  }
};

const getArrivals = async (req, res, next) => {
  try {
    const { icao } = req.params;
    const { begin, end } = req.query;

    if (!begin || !end) {
      return res.status(400).json({
        success: false,
        error: 'Query params "begin" and "end" (Unix timestamps in seconds) are required',
      });
    }

    const flights = await flightService.getAirportFlights(icao.toUpperCase(), 'arrival', Number(begin), Number(end));
    res.json({ success: true, airport: icao.toUpperCase(), count: flights.length, data: flights });
  } catch (err) {
    next(err);
  }
};

const getDepartures = async (req, res, next) => {
  try {
    const { icao } = req.params;
    const { begin, end } = req.query;

    if (!begin || !end) {
      return res.status(400).json({
        success: false,
        error: 'Query params "begin" and "end" (Unix timestamps in seconds) are required',
      });
    }

    const flights = await flightService.getAirportFlights(icao.toUpperCase(), 'departure', Number(begin), Number(end));
    res.json({ success: true, airport: icao.toUpperCase(), count: flights.length, data: flights });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLiveFlights, getAircraft, getArrivals, getDepartures };
