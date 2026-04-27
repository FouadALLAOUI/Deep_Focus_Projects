const { Router } = require('express');
const { searchMarkets, getMarketById, getExchangeRates, getRatesByBase } = require('../controllers/marketController');

const router = Router();

router.get('/search', searchMarkets);
router.get('/currency/rates', getExchangeRates);
router.get('/currency/:base', getRatesByBase);
router.get('/:id', getMarketById);

module.exports = router;
