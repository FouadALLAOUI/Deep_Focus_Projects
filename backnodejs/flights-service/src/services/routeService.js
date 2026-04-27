const axios = require('axios');

const OSRM_URL = 'https://router.project-osrm.org/route/v1';

const PROFILE_MAP = {
  driving: 'driving',
  walking: 'foot',
  cycling: 'bike',
};

const calculateRoute = async ({ startLon, startLat, endLon, endLat, profile = 'driving' }) => {
  const osrmProfile = PROFILE_MAP[profile] || 'driving';
  const coords = `${startLon},${startLat};${endLon},${endLat}`;

  const { data } = await axios.get(`${OSRM_URL}/${osrmProfile}/${coords}`, {
    params: { overview: 'simplified', steps: true, geometries: 'geojson' },
    timeout: 10000,
  });

  if (data.code !== 'Ok') {
    const err = new Error('Could not calculate a route between the given coordinates');
    err.status = 400;
    throw err;
  }

  const route = data.routes[0];

  return {
    profile,
    distance: {
      value: route.distance,
      formatted: `${(route.distance / 1000).toFixed(2)} km`,
    },
    duration: {
      value: route.duration,
      formatted: `${Math.round(route.duration / 60)} min`,
    },
    geometry: route.geometry,
    waypoints: data.waypoints.map((wp) => ({
      name: wp.name || 'Unknown',
      coordinates: wp.location,
    })),
    steps: route.legs[0].steps.map((step) => ({
      type: step.maneuver.type,
      modifier: step.maneuver.modifier || null,
      name: step.name || null,
      distance: `${(step.distance / 1000).toFixed(2)} km`,
      duration: `${Math.round(step.duration / 60)} min`,
    })),
  };
};

module.exports = { calculateRoute };
