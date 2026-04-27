const { Router } = require('express');
const { searchHotels, getHotelById } = require('../controllers/hotelController');

const router = Router();

router.get('/search', searchHotels);
router.get('/:id', getHotelById);

module.exports = router;
