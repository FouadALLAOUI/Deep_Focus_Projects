const { Router } = require('express');
const { getUniversities, getByCountry } = require('../controllers/universityController');

const router = Router();

router.get('/', getUniversities);
router.get('/country/:country', getByCountry);

module.exports = router;
