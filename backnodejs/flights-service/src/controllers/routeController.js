const routeService = require('../services/routeService');

const calculateRoute = async (req, res, next) => {
  try {
    const { startLon, startLat, endLon, endLat, profile = 'driving' } = req.query;

    if (!startLon || !startLat || !endLon || !endLat) {
      return res.status(400).json({
        success: false,
        error: 'Query params "startLon", "startLat", "endLon", "endLat" are required',
        example: '/api/routes?startLon=2.3488&startLat=48.8534&endLon=3.0573&endLat=50.6292&profile=driving',
      });
    }

    const validProfiles = ['driving', 'walking', 'cycling'];
    if (!validProfiles.includes(profile)) {
      return res.status(400).json({
        success: false,
        error: `Invalid profile "${profile}". Must be one of: ${validProfiles.join(', ')}`,
      });
    }

    const route = await routeService.calculateRoute({
      startLon: Number(startLon),
      startLat: Number(startLat),
      endLon: Number(endLon),
      endLat: Number(endLat),
      profile,
    });

    res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateRoute };
