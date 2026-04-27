require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const universityRoutes = require('./src/routes/universityRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

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
    service: 'University Service',
    version: '1.0.0',
    status: 'running',
    description: 'Search and discover universities worldwide — powered by Hipolabs API (free, no key required)',
    endpoints: [
      { method: 'GET', path: '/api/universities?name={name}&country={country}', description: 'Search universities by name and/or country' },
      { method: 'GET', path: '/api/universities/country/:country', description: 'List all universities in a specific country' },
    ],
  });
});

app.use('/api/universities', universityRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[University Service] Running on http://localhost:${PORT}`);
});

module.exports = app;
