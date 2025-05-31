// File: app/abl/country-abl.js
"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const CountryUseCaseError = require("../api/errors/country-use-case-error.js");

class CountryAbl {
  constructor() {
    this.validator = Validator.load();
  }

  /**
   * Creates a new country version
   * Profile: Authorities
   */
  async create(dtoIn) {
    // DTO validation against countryCreateDtoInType
    let validationResult = this.validator.validate("countryCreateDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.Create.InvalidDtoIn);

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    // Business rule: Check if country with this isoCode already exists (as an active one)
    const existingCountry = await countryDao.getCurrent(dtoIn.awid, dtoIn.isoCode);
    if (existingCountry) {
      throw new CountryUseCaseError.Create.CountryAlreadyExists({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }

    // Business rule: Check if the linked currencyIsoCode exists and is active
    const linkedCurrency = await currencyDao.getCurrent(dtoIn.awid, dtoIn.currencyIsoCode);
    if (!linkedCurrency) {
      throw new CountryUseCaseError.Create.LinkedCurrencyNotFound({ awid: dtoIn.awid, currencyIsoCode: dtoIn.currencyIsoCode });
    }

    const countryToCreate = { ...dtoIn };
    delete countryToCreate.awid;

    let createdCountry;
    try {
      createdCountry = await countryDao.create(dtoIn.awid, countryToCreate);
    } catch (e) {
      throw new CountryUseCaseError.Create.CountryDaoCreateFailed({ cause: e });
    }

    return {
      ...createdCountry,
      currencyName: linkedCurrency.name,
      uuAppErrorMap: {},
    };
  }

  /**
   * Gets the current version of a country
   * Profile: Readers, Authorities
   */
  async get(dtoIn) {
    let validationResult = this.validator.validate("countryGetDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.Get.InvalidDtoIn);

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    const country = await countryDao.getCurrent(dtoIn.awid, dtoIn.isoCode);
    if (!country) {
      throw new CountryUseCaseError.Get.CountryNotFound({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }

    // Optionally, enrich with current currency name
    let currencyName = "N/A"; // TODO: prolly no need to check this here - every country should have a currency
    if (country.currencyIsoCode) {
      const currency = await currencyDao.getCurrent(dtoIn.awid, country.currencyIsoCode);
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
  async update(dtoIn) {
    let validationResult = this.validator.validate("countryUpdateDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.Update.InvalidDtoIn());

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    const linkedCurrency = await currencyDao.getCurrent(dtoIn.awid, dtoIn.currencyIsoCode);
    if (!linkedCurrency) {
      throw new CountryUseCaseError.Update.LinkedCurrencyNotFound({ awid: dtoIn.awid, currencyIsoCode: dtoIn.currencyIsoCode });
    }

    let updatedCountry;
    try {
      const { isoCode, ...updateData } = dtoIn;
      delete updateData.awid;
      updatedCountry = await countryDao.update(dtoIn.awid, isoCode, updateData);
    } catch (e) {
      throw new CountryUseCaseError.Update.CountryDaoUpdateFailed({ cause: e });
    }
    if (!updatedCountry) {
      throw new CountryUseCaseError.Update.CountryNotFoundToUpdate({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }

    return {
      ...updatedCountry,
      currencyName: linkedCurrency.name,
      uuAppErrorMap: {},
    };
  }

  /**
   * Archives the current version of a country
   * Profile: Authorities
   */
  async archive(dtoIn) {
    let validationResult = this.validator.validate("countryArchiveDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.Archive.InvalidDtoIn);

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    const archivedCountry = await countryDao.archive(dtoIn.awid, dtoIn.isoCode);
    if (!archivedCountry) {
      throw new CountryUseCaseError.Archive.CountryNotFoundToArchive({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }

    // Optionally enrich with currency name
    let currencyName = "N/A"; // TODO: prolly no need to check this here - every country should have a currency
    if (archivedCountry.currencyIsoCode) {
      const currency = await currencyDao.getCurrent(dtoIn.awid, archivedCountry.currencyIsoCode);
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
  async listCurrent(dtoIn) {
    let validationResult = this.validator.validate("countryListDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.ListCurrent.InvalidDtoIn);

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    const countryListRaw = await countryDao.listCurrent(dtoIn.awid, dtoIn.pageInfo);

    // Enrich items with currency names
    const itemList = await Promise.all(countryListRaw.map(async (country) => {
      let currencyName = "N/A"; // TODO: prolly no need to check this here - every country should have a currency
      if (country.currencyIsoCode) {
        const currency = await currencyDao.getCurrent(dtoIn.awid, country.currencyIsoCode);
        if (currency) {
          currencyName = currency.name;
        }
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
  async getHistory(dtoIn) {
    let validationResult = this.validator.validate("countryGetHistoryDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.GetHistory.InvalidDtoIn);

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    const historyRaw = await countryDao.getHistory(dtoIn.awid, dtoIn.isoCode);

    // Enrich items with currency names
    const itemList = await Promise.all(historyRaw.map(async (countryVersion) => {
      let currencyName = "N/A"; // TODO: prolly no need to check this here - every country should have a currency
      if (countryVersion.currencyIsoCode) {
        const currency = await currencyDao.getCurrent(dtoIn.awid, countryVersion.currencyIsoCode);
        if (currency) {
          currencyName = currency.name;
        }
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
  async listByCurrency(dtoIn) {
    let validationResult = this.validator.validate("countryListByCurrencyDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "invalidDtoIn", CountryUseCaseError.ListByCurrency.InvalidDtoIn);

    const countryDao = DaoFactory.getDao("country");
    const currencyDao = DaoFactory.getDao("currency");

    // Check if the currency itself exists and is active
    const currency = await currencyDao.getCurrent(dtoIn.awid, dtoIn.currencyIsoCode);
    if (!currency) {
      throw new CountryUseCaseError.ListByCurrency.CurrencyNotFound({ awid: dtoIn.awid, currencyIsoCode: dtoIn.currencyIsoCode });
    }

    const countryListRaw = await countryDao.listByCurrency(dtoIn.awid, dtoIn.currencyIsoCode, dtoIn.pageInfo);

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
