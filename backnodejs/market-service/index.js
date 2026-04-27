require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const marketRoutes = require('./src/routes/marketRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3003;

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
    service: 'Market Service',
    version: '1.0.0',
    status: 'running',
    description: 'Discover local markets and live currency exchange rates',
    setup: {
      localMarkets: 'Requires OPENTRIPMAP_API_KEY in .env — get a free key at https://opentripmap.com/product',
      currencyRates: 'No API key required — uses open.er-api.com (free tier)',
    },
    endpoints: [
      { method: 'GET', path: '/api/markets/search?city={city}&radius={meters}&limit={n}', description: 'Find local markets and shops near a city' },
      { method: 'GET', path: '/api/markets/:id', description: 'Get market details by OpenTripMap xid' },
      { method: 'GET', path: '/api/markets/currency/rates?base={currency}', description: 'Get live exchange rates (default base: USD)' },
      { method: 'GET', path: '/api/markets/currency/:base', description: 'Get exchange rates for a specific base currency' },
    ],
  });
});

app.use('/api/markets', marketRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Market Service] Running on http://localhost:${PORT}`);
});

module.exports = app;
