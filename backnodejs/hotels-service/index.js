require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const hotelRoutes = require('./src/routes/hotelRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3002;

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
    service: 'Hotels Service',
    version: '1.0.0',
    status: 'running',
    description: 'Discover hotels and accommodations worldwide — powered by OpenTripMap API',
    setup: 'Requires OPENTRIPMAP_API_KEY in .env — get a free key at https://opentripmap.com/product',
    endpoints: [
      { method: 'GET', path: '/api/hotels/search?city={city}&radius={meters}&limit={n}', description: 'Search hotels near a city' },
      { method: 'GET', path: '/api/hotels/:id', description: 'Get hotel details by OpenTripMap xid' },
    ],
  });
});

app.use('/api/hotels', hotelRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Hotels Service] Running on http://localhost:${PORT}`);
});

module.exports = app;
