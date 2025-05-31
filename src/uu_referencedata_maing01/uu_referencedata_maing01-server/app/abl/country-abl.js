// File: app/abl/country-abl.js
"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const CountryMongo = require("../dao/country-mongo.js");
const CurrencyMongo = require("../dao/currency-mongo.js");
const CountryUseCaseError  = require("../api/errors/country-use-case-error.js");

class CountryAbl {
  constructor() {
    this.validator = Validator.load();
    this.countryDao = CountryMongo;
    this.currencyDao = CurrencyMongo;
  }

  /**
   * Creates a new country version
   * Profile: Authorities
   */
  async create(awid, dtoIn, session, authorizationResult) {
    // DTO validation against countryCreateDtoInType
    let validationResult = this.validator.validate("countryCreateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .Create.InvalidDtoIn({ // Assuming a generic Create error category
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    // Business rule: Check if country with this isoCode already exists (as an active one)
    const existingCountry = await this.countryDao.getCurrent(awid, dtoIn.isoCode);
    if (existingCountry) {
      throw new CountryUseCaseError .Create.CountryAlreadyExists({ awid, isoCode: dtoIn.isoCode });
    }

    // Business rule: Check if the linked currencyIsoCode exists and is active
    const linkedCurrency = await this.currencyDao.getCurrent(awid, dtoIn.currencyIsoCode);
    if (!linkedCurrency) {
      throw new CountryUseCaseError .Create.LinkedCurrencyNotFound({ awid, currencyIsoCode: dtoIn.currencyIsoCode });
    }

    const countryToCreate = { ...dtoIn };
    delete countryToCreate.awid;

    let createdCountry;
    try {
      createdCountry = await this.countryDao.create(awid, countryToCreate);
    } catch (e) {
      throw new CountryUseCaseError .Create.CountryDaoCreateFailed({ cause: e });
    }

    return {
      ...createdCountry,
      // If we removed currencyName from DAO, we might want to add it here for the DTO out by using linkedCurrency.name
      // currencyName: linkedCurrency.name, // Example of enriching DtoOut
      uuAppErrorMap: {},
    };
  }

  /**
   * Gets the current version of a country
   * Profile: Readers, Authorities
   */
  async get(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("countryGetDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .Get.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const country = await this.countryDao.getCurrent(awid, dtoIn.isoCode);
    if (!country) {
      throw new CountryUseCaseError .Get.CountryNotFound({ awid, isoCode: dtoIn.isoCode });
    }

    // Optionally, enrich with current currency name
    let currencyName = "N/A";
    if (country.currencyIsoCode) {
      const currency = await this.currencyDao.getCurrent(awid, country.currencyIsoCode);
      if (currency) {
        currencyName = currency.name;
      }
    }

    return {
      ...country,
      currencyName, // Add looked-up currency name
      uuAppErrorMap: {},
    };
  }

  /**
   * Updates a country, creating a new version
   * Profile: Authorities
   */
  async update(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("countryUpdateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .Update.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    // If currencyIsoCode is being updated, check if the new one exists
    if (dtoIn.currencyIsoCode) {
      const linkedCurrency = await this.currencyDao.getCurrent(awid, dtoIn.currencyIsoCode);
      if (!linkedCurrency) {
        throw new CountryUseCaseError .Update.LinkedCurrencyNotFound({ awid, currencyIsoCode: dtoIn.currencyIsoCode });
      }
    }

    let updatedCountry;
    try {
      const { isoCode, ...updateData } = dtoIn;
      delete updateData.awid;
      updatedCountry = await this.countryDao.update(awid, isoCode, updateData);
    } catch (e) {
      throw new CountryUseCaseError .Update.CountryDaoUpdateFailed({ cause: e });
    }
    if (!updatedCountry) {
      throw new CountryUseCaseError .Update.CountryNotFoundToUpdate({ awid, isoCode: dtoIn.isoCode });
    }

    // Optionally enrich with current currency name for the DtoOut
    let currencyName = "N/A";
    if (updatedCountry.currencyIsoCode) {
      const currency = await this.currencyDao.getCurrent(awid, updatedCountry.currencyIsoCode);
      if (currency) {
        currencyName = currency.name;
      }
    }

    return {
      ...updatedCountry,
      currencyName,
      uuAppErrorMap: {},
    };
  }

  /**
   * Archives the current version of a country
   * Profile: Authorities
   */
  async archive(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("countryArchiveDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .Archive.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const archivedCountry = await this.countryDao.archive(awid, dtoIn.isoCode);
    if (!archivedCountry) {
      throw new CountryUseCaseError .Archive.CountryNotFoundToArchive({ awid, isoCode: dtoIn.isoCode });
    }

    // Optionally enrich with currency name
    let currencyName = "N/A";
    if (archivedCountry.currencyIsoCode) {
      const currency = await this.currencyDao.getCurrent(awid, archivedCountry.currencyIsoCode);
      if (currency) {
        currencyName = currency.name;
      }
    }

    return {
      ...archivedCountry,
      currencyName,
      uuAppErrorMap: {},
    };
  }

  /**
   * Lists currently active countries
   * Profile: Readers, Authorities
   */
  async listCurrent(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("countryListDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .ListCurrent.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const countryListRaw = await this.countryDao.listCurrent(awid, dtoIn.pageInfo);

    // Enrich items with currency names
    const itemList = await Promise.all(countryListRaw.map(async (country) => {
      let currencyName = "N/A";
      if (country.currencyIsoCode) {
        const currency = await this.currencyDao.getCurrent(awid, country.currencyIsoCode);
        if (currency) currencyName = currency.name;
      }
      return {...country, currencyName};
    }));

    return {
      itemList,
      pageInfo: dtoIn.pageInfo,
      uuAppErrorMap: {},
    };
  }

  /**
   * Gets the history of a country
   * Profile: Readers, Authorities
   */
  async getHistory(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("countryGetHistoryDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .GetHistory.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const historyRaw = await this.countryDao.getHistory(awid, dtoIn.isoCode);

    // Enrich items with currency names
    const itemList = await Promise.all(historyRaw.map(async (countryVersion) => {
      let currencyName = "N/A";
      if (countryVersion.currencyIsoCode) {
        // For history, we might want the currency as it was, but our currency DAO gives current.
        // If currencies are versioned, a more complex lookup for currency version valid at countryVersion's time might be needed.
        // For simplicity, using current name of the linked currency.
        const currency = await this.currencyDao.getCurrent(awid, countryVersion.currencyIsoCode);
        if (currency) currencyName = currency.name;
      }
      return {...countryVersion, currencyName};
    }));

    return {
      itemList,
      uuAppErrorMap: {},
    };
  }

  /**
   * Lists currently active countries by currency
   * Profile: Readers, Authorities
   */
  async listByCurrency(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("countryListByCurrencyDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CountryUseCaseError .ListByCurrency.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    // Check if the currency itself exists and is active
    const currency = await this.currencyDao.getCurrent(awid, dtoIn.currencyIsoCode);
    if (!currency) {
      throw new CountryUseCaseError .ListByCurrency.CurrencyNotFound({ awid, currencyIsoCode: dtoIn.currencyIsoCode });
    }

    const countryListRaw = await this.countryDao.listByCurrency(awid, dtoIn.currencyIsoCode, dtoIn.pageInfo);

    // Enrich with currency names (will be the same for all, i.e., currency.name)
    const itemList = countryListRaw.map(country => ({
      ...country,
      currencyName: currency.name
    }));

    return {
      itemList,
      pageInfo: dtoIn.pageInfo,
      uuAppErrorMap: {},
    };
  }
}

module.exports = new CountryAbl();
