require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const flightRoutes = require('./src/routes/flightRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later.' },
  })
);

app.get('/', (req, res) => {
  res.json({
    service: 'Flights & Routes Service',
    version: '1.0.0',
    status: 'running',
    description: 'Live flight tracking and travel route planning',
    setup: {
      liveFlights: 'No credentials needed — uses OpenSky Network (anonymous rate limits apply)',
      airportHistory: 'Requires OPENSKY_USERNAME and OPENSKY_PASSWORD in .env — register free at https://opensky-network.org/',
      routing: 'No API key required — uses OSRM public server (free)',
    },
    endpoints: [
      { method: 'GET', path: '/api/flights/live?lamin=&lomin=&lamax=&lomax=', description: 'All live flights (optional geographic bounding box)' },
      { method: 'GET', path: '/api/flights/aircraft/:icao24', description: 'Track a specific aircraft by ICAO24 address' },
      { method: 'GET', path: '/api/flights/airport/:icao/arrivals?begin={unix}&end={unix}', description: 'Airport arrivals in a time range (credentials required)' },
      { method: 'GET', path: '/api/flights/airport/:icao/departures?begin={unix}&end={unix}', description: 'Airport departures in a time range (credentials required)' },
      { method: 'GET', path: '/api/routes?startLon=&startLat=&endLon=&endLat=&profile={driving|walking|cycling}', description: 'Calculate a travel route between two coordinates' },
    ],
  });
});

app.use('/api/flights', flightRoutes);
app.use('/api/routes', routeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Flights & Routes Service] Running on http://localhost:${PORT}`);
});

module.exports = app;
