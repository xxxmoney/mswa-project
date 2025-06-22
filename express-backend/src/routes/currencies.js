const express = require('express');
const currencyController = require('../controllers/currencyController');

const router = express.Router();

// All routes require id parameter (UUID) except create
router.param('id', (req, res, next, id) => {
  req.params.id = id;
  next();
});

// Currency routes
router.post('/', currencyController.create);
router.get('/:isoCode', currencyController.get);
router.put('/:isoCode', currencyController.update);
router.delete('/:isoCode', currencyController.archive);
router.get('/', currencyController.listCurrent);
router.get('/:isoCode/history', currencyController.getHistory);

module.exports = router; 