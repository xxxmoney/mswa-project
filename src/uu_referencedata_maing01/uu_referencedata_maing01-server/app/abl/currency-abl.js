// File: app/abl/currency-abl.js
"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const CurrencyMongo = require("../dao/currency-mongo.js");
const CurrencyUseCaseError = require("../api/errors/currency-use-case-error.js");

class CurrencyAbl {
  constructor() {
    this.validator = Validator.load();

    this.dao = CurrencyMongo;
  }

  /**
   * Creates a new currency version
   * Profile: Authorities
   */
  async create(dtoIn) {
    let validationResult = this.validator.validate("currencyCreateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CurrencyUseCaseError.Create.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const existingCurrency = await this.dao.getCurrent(dtoIn.awid, dtoIn.isoCode);
    if (existingCurrency) {
      throw new CurrencyUseCaseError.Create.CurrencyAlreadyExists({ awid, isoCode: dtoIn.isoCode });
    }

    const currencyToCreate = { ...dtoIn }; // DAO expects awid to be passed separately
    delete currencyToCreate.awid; // dtoIn might contain awid, DAO method signature takes it as first param

    let createdCurrency;
    try {
      createdCurrency = await this.dao.create(dtoIn.awid, currencyToCreate);
    } catch (e) {
      throw new CurrencyUseCaseError.Create.CurrencyDaoCreateFailed({ cause: e });
    }

    return {
      ...createdCurrency,
      uuAppErrorMap: {},
    };
  }

  /**
   * Gets the current version of a currency
   * Profile: Readers, Authorities (or any authenticated user)
   */
  async get(dtoIn) {
    let validationResult = this.validator.validate("currencyGetDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CurrencyUseCaseError.Get.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const currency = await this.dao.getCurrent(dtoIn.awid, dtoIn.isoCode);
    if (!currency) {
      throw new CurrencyUseCaseError.Get.CurrencyNotFound({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }

    return {
      ...currency,
      uuAppErrorMap: {},
    };
  }

  /**
   * Updates a currency, creating a new version
   * Profile: Authorities
   */
  async update(dtoIn) {
    let validationResult = this.validator.validate("currencyUpdateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CurrencyUseCaseError.Update.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    let updatedCurrency;
    try {
      const { isoCode, ...updateData } = dtoIn;
      delete updateData.awid;

      updatedCurrency = await this.dao.update(dtoIn.awid, isoCode, updateData);
    } catch (e) {
      if (e.code === CurrencyUseCaseError.Get.CurrencyNotFound.UC_CODE) { // Example if DAO throws specific not found
        throw e;
      }
      throw new CurrencyUseCaseError.Update.CurrencyDaoUpdateFailed({ cause: e });
    }
    if (!updatedCurrency) { // If DAO.update returns null on not finding a current to update.
      throw new CurrencyUseCaseError.Update.CurrencyNotFoundToUpdate({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }


    return {
      ...updatedCurrency,
      uuAppErrorMap: {},
    };
  }

  /**
   * Archives the current version of a currency
   * Profile: Authorities
   */
  async archive(dtoIn) {
    let validationResult = this.validator.validate("currencyArchiveDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CurrencyUseCaseError.Archive.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const archivedCurrency = await this.dao.archive(dtoIn.awid, dtoIn.isoCode);
    if (!archivedCurrency) {
      throw new CurrencyUseCaseError.Archive.CurrencyNotFoundToArchive({ awid: dtoIn.awid, isoCode: dtoIn.isoCode });
    }

    return {
      ...archivedCurrency,
      uuAppErrorMap: {},
    };
  }

  /**
   * Lists currently active currencies
   * Profile: Readers, Authorities (or any authenticated user)
   */
  async listCurrent(dtoIn) {
    let validationResult = this.validator.validate("currencyListDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CurrencyUseCaseError.ListCurrent.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const currencyList = await this.dao.listCurrent(dtoIn.awid, dtoIn.pageInfo);

    return {
      itemList: currencyList,
      pageInfo: dtoIn.pageInfo,
      uuAppErrorMap: {},
    };
  }

  /**
   * Gets the history of a currency
   * Profile: Readers, Authorities (or any authenticated user)
   */
  async getHistory(dtoIn) {
    let validationResult = this.validator.validate("currencyGetHistoryDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new CurrencyUseCaseError.GetHistory.InvalidDtoIn({
        uuAppErrorMap: validationResult.getErrors(),
      });
    }

    const history = await this.dao.getHistory(dtoIn.awid, dtoIn.isoCode);
    return {
      itemList: history,
      uuAppErrorMap: {},
    };
  }
}

module.exports = new CurrencyAbl();
