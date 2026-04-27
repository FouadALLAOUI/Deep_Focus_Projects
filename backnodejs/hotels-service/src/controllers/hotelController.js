const hotelService = require('../services/hotelService');

const searchHotels = async (req, res, next) => {
  try {
    const { city, radius = 5000, limit = 20 } = req.query;

    if (!city) {
      return res.status(400).json({ success: false, error: 'Query parameter "city" is required' });
    }

    const result = await hotelService.searchHotels({ city, radius: Number(radius), limit: Number(limit) });

    res.json({
      success: true,
      count: result.hotels.length,
      location: { city, lat: result.lat, lon: result.lon },
      data: result.hotels,
    });
  } catch (err) {
    next(err);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.getHotelDetails(id);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchHotels, getHotelById };
