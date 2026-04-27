const axios = require('axios');

const OPENSKY_URL = 'https://opensky-network.org/api';

const getAuth = () => {
  if (process.env.OPENSKY_USERNAME && process.env.OPENSKY_PASSWORD) {
    return { auth: { username: process.env.OPENSKY_USERNAME, password: process.env.OPENSKY_PASSWORD } };
  }
  return {};
};

const mapState = (s) => ({
  icao24: s[0],
  callsign: s[1]?.trim() || null,
  originCountry: s[2],
  longitude: s[5],
  latitude: s[6],
  altitude: s[7],
  onGround: s[8],
  velocity: s[9],
  heading: s[10],
  verticalRate: s[11],
  squawk: s[14],
});

const getLiveFlights = async ({ lamin, lomin, lamax, lomax } = {}) => {
  const params = {};
  if (lamin !== undefined) {
    params.lamin = lamin;
    params.lomin = lomin;
    params.lamax = lamax;
    params.lomax = lomax;
  }

  const { data } = await axios.get(`${OPENSKY_URL}/states/all`, {
    params,
    ...getAuth(),
    timeout: 15000,
  });

  const flights = (data.states || []).map(mapState);
  return { time: data.time, total: flights.length, flights };
};

const getAircraftState = async (icao24) => {
  const { data } = await axios.get(`${OPENSKY_URL}/states/all`, {
    params: { icao24 },
    ...getAuth(),
    timeout: 10000,
  });

  if (!data.states?.length) {
    const err = new Error(`Aircraft "${icao24}" is not currently active or was not found`);
    err.status = 404;
    throw err;
  }

  return mapState(data.states[0]);
};

const getAirportFlights = async (icao, type, begin, end) => {
  if (!process.env.OPENSKY_USERNAME || !process.env.OPENSKY_PASSWORD) {
    const err = new Error(
      'OpenSky credentials required for airport flight history. Set OPENSKY_USERNAME and OPENSKY_PASSWORD in .env — register free at https://opensky-network.org/'
    );
    err.status = 401;
    throw err;
  }

  const { data } = await axios.get(`${OPENSKY_URL}/flights/${type}`, {
    params: { airport: icao, begin, end },
    ...getAuth(),
    timeout: 15000,
  });

  return data;
};

module.exports = { getLiveFlights, getAircraftState, getAirportFlights };
