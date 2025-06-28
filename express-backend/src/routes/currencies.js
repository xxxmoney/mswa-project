const express = require('express');
const currencyController = require('../controllers/currencyController');

const router = express.Router();

// Currency routes
router.post('/', currencyController.create);
router.get('/:isoCode', currencyController.get);
router.put('/:isoCode', currencyController.update);
router.delete('/:isoCode', currencyController.archive);
router.get('/', currencyController.listCurrent);
router.get('/:isoCode/history', currencyController.getHistory);

module.exports = router; 