const { Router } = require('express');
const { calculateRoute } = require('../controllers/routeController');

const router = Router();

router.get('/', calculateRoute);

module.exports = router;
