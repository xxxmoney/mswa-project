// File: app/api/errors/country-use-case-error.js
"use strict";
const ReferencedataMainError = require("./referencedata-main-error.js");

const ERROR_PREFIX = ReferencedataMainError.ERROR_PREFIX + "country/"; // Specific prefix for country errors

const Create = {
  UC_CODE: ERROR_PREFIX + "create/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ...similar to currency ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CountryAlreadyExists: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause); // Or 409 Conflict
      this.code = `${Create.UC_CODE}countryAlreadyExists`;
      this.message = "Country with the given ISO code already exists and is active.";
    }
  },
  LinkedCurrencyNotFound: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause); // Bad request as currency is a dependency
      this.code = `${Create.UC_CODE}linkedCurrencyNotFound`;
      this.message = "The linked currency ISO code does not correspond to an active currency.";
    }
  },
  CountryDaoCreateFailed: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 500 }, paramMap, cause);
      this.code = `${Create.UC_CODE}countryDaoCreateFailed`;
      this.message = "Creating country in DAO failed.";
    }
  }
};

const Get = {
  UC_CODE: ERROR_PREFIX + "get/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CountryNotFound: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${Get.UC_CODE}countryNotFound`;
      this.message = "Country not found.";
    }
  }
};

const Update = {
  UC_CODE: ERROR_PREFIX + "update/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CountryNotFoundToUpdate: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${Update.UC_CODE}countryNotFoundToUpdate`;
      this.message = "Active country to update not found.";
    }
  },
  LinkedCurrencyNotFound: class extends ReferencedataMainError { // If currency is changed during update
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Update.UC_CODE}linkedCurrencyNotFound`;
      this.message = "The new linked currency ISO code does not correspond to an active currency.";
    }
  },
  CountryDaoUpdateFailed: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 500 }, paramMap, cause);
      this.code = `${Update.UC_CODE}countryDaoUpdateFailed`;
      this.message = "Updating country in DAO failed.";
    }
  }
};

const Archive = {
  UC_CODE: ERROR_PREFIX + "archive/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Archive.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CountryNotFoundToArchive: class extends ReferencedataMainError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${Archive.UC_CODE}countryNotFoundToArchive`;
      this.message = "Active country to archive not found.";
    }
  }
};

const ListCurrent = { // For country/listCurrent
  UC_CODE: ERROR_PREFIX + "listCurrent/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${ListCurrent.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const GetHistory = { // For country/getHistory
  UC_CODE: ERROR_PREFIX + "getHistory/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${GetHistory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const ListByCurrency = {
  UC_CODE: ERROR_PREFIX + "listByCurrency/",
  InvalidDtoIn: class extends ReferencedataMainError { /* ... */
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${ListByCurrency.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CurrencyNotFound: class extends ReferencedataMainError { // If the currency to filter by doesn't exist
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${ListByCurrency.UC_CODE}currencyNotFound`;
      this.message = "Currency to filter by was not found.";
    }
  }
};

module.exports = {
  Create,
  Get,
  Update,
  Archive,
  ListCurrent,
  GetHistory,
  ListByCurrency
};
