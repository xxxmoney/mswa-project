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
router.get('/:id/:isoCode', currencyController.get);
router.put('/:id/:isoCode', currencyController.update);
router.delete('/:id/:isoCode', currencyController.archive);
router.get('/:id', currencyController.listCurrent);
router.get('/:id/:isoCode/history', currencyController.getHistory);

module.exports = router; 