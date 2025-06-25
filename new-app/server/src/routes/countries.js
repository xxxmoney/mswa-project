const express = require('express');
const countryController = require('new-app/server/src/controllers/countryController');

const router = express.Router();

// All routes require id parameter (UUID) except create
router.param('id', (req, res, next, id) => {
  req.params.id = id;
  next();
});

// Country routes
router.post('/', countryController.create);
router.get('/:id/:isoCode', countryController.get);
router.put('/:id/:isoCode', countryController.update);
router.delete('/:id/:isoCode', countryController.archive);
router.get('/:id', countryController.listCurrent);
router.get('/:id/:isoCode/history', countryController.getHistory);
router.get('/:id/currency/:currencyIsoCode', countryController.listByCurrency);

module.exports = router; 