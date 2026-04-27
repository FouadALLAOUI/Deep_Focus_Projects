const marketService = require('../services/marketService');

const searchMarkets = async (req, res, next) => {
  try {
    const { city, radius = 5000, limit = 20 } = req.query;

    if (!city) {
      return res.status(400).json({ success: false, error: 'Query parameter "city" is required' });
    }

    const result = await marketService.searchMarkets({ city, radius: Number(radius), limit: Number(limit) });

    res.json({
      success: true,
      count: result.markets.length,
      location: { city, lat: result.lat, lon: result.lon },
      data: result.markets,
    });
  } catch (err) {
    next(err);
  }
};

const getMarketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const market = await marketService.getMarketDetails(id);
    res.json({ success: true, data: market });
  } catch (err) {
    next(err);
  }
};

const getExchangeRates = async (req, res, next) => {
  try {
    const { base = 'USD' } = req.query;
    const rates = await marketService.getExchangeRates(base.toUpperCase());
    res.json({ success: true, data: rates });
  } catch (err) {
    next(err);
  }
};

const getRatesByBase = async (req, res, next) => {
  try {
    const { base } = req.params;
    const rates = await marketService.getExchangeRates(base.toUpperCase());
    res.json({ success: true, data: rates });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchMarkets, getMarketById, getExchangeRates, getRatesByBase };
