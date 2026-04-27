const axios = require('axios');

const BASE_URL = 'https://api.opentripmap.com/0.1/en';

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
  const { data } = await axios.get(`${BASE_URL}/geocoding/geoname`, {
    params: { name: city, apikey: getApiKey() },
    timeout: 10000,
  });

  if (!data.lat) {
    const err = new Error(`City "${city}" not found`);
    err.status = 404;
    throw err;
  }

  return { lat: data.lat, lon: data.lon, name: data.name, country: data.country };
};

const searchHotels = async ({ city, radius = 5000, limit = 20 }) => {
  const location = await getCityCoords(city);

  const { data } = await axios.get(`${BASE_URL}/places/radius`, {
    params: {
      radius,
      lon: location.lon,
      lat: location.lat,
      kinds: 'accomodations',
      limit,
      format: 'json',
      apikey: getApiKey(),
    },
    timeout: 10000,
  });

  return { lat: location.lat, lon: location.lon, hotels: data };
};

const getHotelDetails = async (xid) => {
  const { data } = await axios.get(`${BASE_URL}/places/xid/${xid}`, {
    params: { apikey: getApiKey() },
    timeout: 10000,
  });
  return data;
};

module.exports = { searchHotels, getHotelDetails };
