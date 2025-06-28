const Country = require('../models/Country');
const Currency = require('../models/Currency');
const countryValidation = require('../validation/countryValidation');
const NotificationService = require('../services/notificationService');
const { v4: uuidv4 } = require('uuid');

const countryController = {
  // Create a new country
  async create(req, res, next) {
    try {
      const id = uuidv4();
      
      const requestBody = { ...req.body };

      const { error } = countryValidation.create.validate(requestBody);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { isoCode, name, currencyIsoCode, validFrom, validTo } = req.body;

      // Check if country with this isoCode already exists (as an active one)
      const existingCountry = await Country.getCurrent(id, isoCode);
      if (existingCountry) {
        return res.status(409).json({
          success: false,
          error: `Country with ISO code ${isoCode} already exists`
        });
      }

      // Check if the linked currency exists and is active
      const linkedCurrency = await Currency.getByIsoCode(currencyIsoCode);
      if (!linkedCurrency) {
        return res.status(404).json({
          success: false,
          error: `Linked currency with ISO code ${currencyIsoCode} not found`
        });
      }

      // Create the country
      const countryData = {
        id,
        isoCode,
        name,
        currencyIsoCode,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validTo: validTo ? new Date(validTo) : null
      };

      const createdCountry = await Country.createCountry(countryData);

      // Create notification for country creation
      await NotificationService.createCreationNotification(
        'Country',
        createdCountry.id,
        createdCountry.isoCode,
        {
          countryName: createdCountry.name,
          currencyIsoCode: createdCountry.currencyIsoCode,
          validFrom: createdCountry.validFrom,
          validTo: createdCountry.validTo
        }
      );

      res.status(201).json({
        success: true,
        data: {
          ...createdCountry.toObject(),
          currencyName: linkedCurrency.name
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const countries = await Country.find({});
      res.json({ success: true, data: countries });
    } catch (error) {
      next(error);
    }
  },

  // Get current version of a country
  async get(req, res, next) {
    try {
      const { error } = countryValidation.get.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;

      const country = await Country.getCurrent(id, isoCode);
      if (!country) {
        return res.status(404).json({
          success: false,
          error: `Country with ISO code ${isoCode} not found`
        });
      }

      let currency = null;

      if (country.currencyIsoCode) {
        currency = await Currency.getByIsoCode(country.currencyIsoCode);
      }

      res.json({
        success: true,
        data: {
          ...country.toObject(),
          currency,
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update a country (creates new version)
  async update(req, res, next) {
    try {
      const { error } = countryValidation.update.validate({ ...req.params, ...req.body });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;
      const updateData = req.body;

      // Check if currency exists if it's being updated
      if (updateData.currencyIsoCode) {
        const linkedCurrency = await Currency.getByIsoCode(updateData.currencyIsoCode);
        if (!linkedCurrency) {
          return res.status(404).json({
            success: false,
            error: `Linked currency with ISO code ${updateData.currencyIsoCode} not found`
          });
        }
      }

      const updatedCountry = await Country.updateCountry(id, isoCode, updateData);
      if (!updatedCountry) {
        return res.status(404).json({
          success: false,
          error: `Country with ISO code ${isoCode} not found to update`
        });
      }

      // Create notification for country update
      await NotificationService.createUpdateNotification(
        'Country',
        updatedCountry.id,
        updatedCountry.isoCode,
        {
          countryName: updatedCountry.name,
          currencyIsoCode: updatedCountry.currencyIsoCode,
          validFrom: updatedCountry.validFrom,
          validTo: updatedCountry.validTo,
          changes: updateData
        }
      );

      const currency = await Currency.getByIsoCode(updatedCountry.currencyIsoCode);
      const currencyName = currency ? currency.name : "N/A";

      res.json({
        success: true,
        data: {
          ...updatedCountry.toObject(),
          currencyName
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Archive a country
  async archive(req, res, next) {
    try {
      const { error } = countryValidation.archive.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, isoCode } = req.params;

      const archivedCountry = await Country.archiveCountry(id, isoCode);
      if (!archivedCountry) {
        return res.status(404).json({
          success: false,
          error: `Country with ISO code ${isoCode} not found to archive`
        });
      }

      // Create notification for country archivation
      await NotificationService.createArchiveNotification(
        'Country',
        archivedCountry.id,
        archivedCountry.isoCode,
        {
          countryName: archivedCountry.name,
          currencyIsoCode: archivedCountry.currencyIsoCode,
          validFrom: archivedCountry.validFrom,
          validTo: archivedCountry.validTo
        }
      );

      let currencyName = "N/A";
      if (archivedCountry.currencyIsoCode) {
        const currency = await Currency.getByIsoCode(archivedCountry.currencyIsoCode);
        if (currency) {
          currencyName = currency.name;
        }
      }

      res.json({
        success: true,
        data: {
          ...archivedCountry.toObject(),
          currencyName
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // List current countries
  async listCurrent(req, res, next) {
    try {
      const { error } = countryValidation.list.validate({ ...req.query });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const pageInfo = {
        pageIndex: parseInt(req.query.pageIndex) || 0,
        pageSize: parseInt(req.query.pageSize) || 50
      };

      const countryList = await Country.listCurrent(pageInfo);

      const enrichedList = await Promise.all(countryList.map(async (country) => {
        const countryData = country.toObject();

        return {
          ...countryData,
          currency: countryData.currencyIsoCode ? await Currency.getByIsoCode(countryData.currencyIsoCode) : undefined
        };
      }));

      res.json({
        success: true,
        data: {
          itemList: enrichedList,
          pageInfo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get history of a country
  async getHistory(req, res, next) {
    try {
      const { error } = countryValidation.getHistory.validate({ ...req.params, ...req.query });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { isoCode } = req.params;
      const pageInfo = {
        pageIndex: parseInt(req.query.pageIndex) || 0,
        pageSize: parseInt(req.query.pageSize) || 50
      };

      const history = await Country.getHistory(isoCode, pageInfo);

      const enrichedHistory = await Promise.all(history.map(async (countryVersion) => {
        let currencyName = "N/A";
        if (countryVersion.currencyIsoCode) {
          const currency = await Currency.getByIsoCode(countryVersion.currencyIsoCode);
          if (currency) {
            currencyName = currency.name;
          }
        }
        return {
          ...countryVersion.toObject(),
          currencyName
        };
      }));

      res.json({
        success: true,
        data: {
          itemList: enrichedHistory
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // List countries by currency
  async listByCurrency(req, res, next) {
    try {
      const { error } = countryValidation.listByCurrency.validate({ ...req.params, ...req.query });
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id, currencyIsoCode } = req.params;
      const pageInfo = {
        pageIndex: parseInt(req.query.pageIndex) || 0,
        pageSize: parseInt(req.query.pageSize) || 50
      };

      // Check if the currency exists and is active
      const currency = await Currency.getByIsoCode(currencyIsoCode);
      if (!currency) {
        return res.status(404).json({
          success: false,
          error: `Currency with ISO code ${currencyIsoCode} not found`
        });
      }

      const countryList = await Country.listByCurrency(id, currencyIsoCode, pageInfo);

      const enrichedList = countryList.map(country => ({
        ...country.toObject(),
        currencyName: currency.name
      }));

      res.json({
        success: true,
        data: {
          itemList: enrichedList,
          pageInfo
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = countryController; 