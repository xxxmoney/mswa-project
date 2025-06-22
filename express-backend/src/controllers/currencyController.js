const Currency = require('../models/Currency');
const currencyValidation = require('../validation/currencyValidation');
const { v4: uuidv4 } = require('uuid');

const currencyController = {
  // Create a new currency
  async create(req, res, next) {
    try {
      const id = uuidv4();
      
      const requestBody = { ...req.body, id };
      
      const { error } = currencyValidation.create.validate(requestBody);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { isoCode, name, validFrom, validTo } = req.body;

      // Check if currency with this isoCode already exists (as an active one)
      const existingCurrency = await Currency.getCurrent(id, isoCode);
      if (existingCurrency) {
        return res.status(409).json({
          success: false,
          error: `Currency with ISO code ${isoCode} already exists`
        });
      }

      // Create the currency
      const currencyData = {
        id,
        isoCode,
        name,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validTo: validTo ? new Date(validTo) : null
      };

      const createdCurrency = await Currency.create(currencyData);

      res.status(201).json({
        success: true,
        data: createdCurrency
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current version of a currency
  async get(req, res, next) {
    try {
      const { error } = currencyValidation.get.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;

      const currency = await Currency.getCurrent(id, isoCode);
      if (!currency) {
        return res.status(404).json({
          success: false,
          error: `Currency with ISO code ${isoCode} not found`
        });
      }

      res.json({
        success: true,
        data: currency
      });
    } catch (error) {
      next(error);
    }
  },

  // Update a currency (creates new version)
  async update(req, res, next) {
    try {
      const { error } = currencyValidation.update.validate({ ...req.params, ...req.body });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;
      const updateData = req.body;

      const updatedCurrency = await Currency.updateCurrency(id, isoCode, updateData);
      if (!updatedCurrency) {
        return res.status(404).json({
          success: false,
          error: `Currency with ISO code ${isoCode} not found to update`
        });
      }

      res.json({
        success: true,
        data: updatedCurrency
      });
    } catch (error) {
      next(error);
    }
  },

  // Archive a currency
  async archive(req, res, next) {
    try {
      const { error } = currencyValidation.archive.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;

      const archivedCurrency = await Currency.archiveCurrency(id, isoCode);
      if (!archivedCurrency) {
        return res.status(404).json({
          success: false,
          error: `Currency with ISO code ${isoCode} not found to archive`
        });
      }

      res.json({
        success: true,
        data: archivedCurrency
      });
    } catch (error) {
      next(error);
    }
  },

  // List current currencies
  async listCurrent(req, res, next) {
    try {
      const { error } = currencyValidation.list.validate({ ...req.params, ...req.query });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id } = req.params;
      const pageInfo = {
        pageIndex: parseInt(req.query.pageIndex) || 0,
        pageSize: parseInt(req.query.pageSize) || 50
      };

      const currencyList = await Currency.listCurrent(id, pageInfo);

      res.json({
        success: true,
        data: {
          itemList: currencyList,
          pageInfo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get history of a currency
  async getHistory(req, res, next) {
    try {
      const { error } = currencyValidation.getHistory.validate({ ...req.params, ...req.query });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;
      const pageInfo = {
        pageIndex: parseInt(req.query.pageIndex) || 0,
        pageSize: parseInt(req.query.pageSize) || 50
      };

      const history = await Currency.getHistory(id, isoCode, pageInfo);

      res.json({
        success: true,
        data: {
          itemList: history
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = currencyController; 