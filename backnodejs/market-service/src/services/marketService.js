const axios = require('axios');

const OPENTRIPMAP_URL = 'https://api.opentripmap.com/0.1/en';
const EXCHANGE_RATES_URL = 'https://open.er-api.com/v6';

const getApiKey = () => {
  if (!process.env.OPENTRIPMAP_API_KEY) {
    const err = new Error(
      'OPENTRIPMAP_API_KEY is not configured. Get your free key at https://opentripmap.com/product and add it to .env'
    );
    err.status = 503;
    throw err;
  }
  return process.env.OPENTRIPMAP_API_KEY;
};

const getCityCoords = async (city) => {
  const { data } = await axios.get(`${OPENTRIPMAP_URL}/geocoding/geoname`, {
    params: { name: city, apikey: getApiKey() },
    timeout: 10000,
  });

  if (!data.lat) {
    const err = new Error(`City "${city}" not found`);
    err.status = 404;
    throw err;
  }

  return { lat: data.lat, lon: data.lon };
};

const searchMarkets = async ({ city, radius = 5000, limit = 20 }) => {
  const location = await getCityCoords(city);

  const { data } = await axios.get(`${OPENTRIPMAP_URL}/places/radius`, {
    params: {
      radius,
      lon: location.lon,
      lat: location.lat,
      kinds: 'shops',
      limit,
      format: 'json',
      apikey: getApiKey(),
    },
    timeout: 10000,
  });

  return { lat: location.lat, lon: location.lon, markets: data };
};

const getMarketDetails = async (xid) => {
  const { data } = await axios.get(`${OPENTRIPMAP_URL}/places/xid/${xid}`, {
    params: { apikey: getApiKey() },
    timeout: 10000,
  });
  return data;
};

const getExchangeRates = async (base = 'USD') => {
  const { data } = await axios.get(`${EXCHANGE_RATES_URL}/latest/${base}`, { timeout: 10000 });

  if (data.result !== 'success') {
    const err = new Error(`Invalid or unsupported base currency: ${base}`);
    err.status = 400;
    throw err;
  }

  return {
    base: data.base_code,
    lastUpdated: data.time_last_update_utc,
    nextUpdate: data.time_next_update_utc,
    rates: data.rates,
  };
};

module.exports = { searchMarkets, getMarketDetails, getExchangeRates };
