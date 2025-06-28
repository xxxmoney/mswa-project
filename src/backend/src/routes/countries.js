const express = require('express');
const countryController = require('../controllers/countryController');

const router = express.Router();

// All routes require id parameter (UUID) except create
router.param('id', (req, res, next, id) => {
  req.params.id = id;
  next();
});

// Country routes
router.post('/', countryController.create);
router.get('/:isoCode', countryController.get);
router.put('/:isoCode', countryController.update);
router.delete('/:isoCode', countryController.archive);
router.get('/', countryController.listCurrent);
router.get('/:isoCode/history', countryController.getHistory);
router.get('/currency/:currencyIsoCode', countryController.listByCurrency);
router.delete('/:isoCode/delete', countryController.removeCountry);

module.exports = router; 