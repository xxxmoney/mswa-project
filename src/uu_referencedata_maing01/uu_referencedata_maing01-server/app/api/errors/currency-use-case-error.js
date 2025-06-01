// File: app/api/errors/currency-use-case-error.js
"use strict";
const ReferencedataMainUseCaseError = require("./referencedata-main-use-case-error.js"); // Base error for this subApp

const ERROR_PREFIX = ReferencedataMainUseCaseError.ERROR_PREFIX + "currency/"; // Specific prefix for currency errors

const Create = {
  UC_CODE: ERROR_PREFIX + "create/",
  InvalidDtoIn: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CurrencyAlreadyExists: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause); // Or 409 Conflict
      this.code = `${Create.UC_CODE}currencyAlreadyExists`;
      this.message = "Currency with the given ISO code already exists and is active.";
    }
  },
  CurrencyDaoCreateFailed: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 500 }, paramMap, cause);
      this.code = `${Create.UC_CODE}currencyDaoCreateFailed`;
      this.message = "Creating currency in DAO failed.";
    }
  }
};

const Get = {
  UC_CODE: ERROR_PREFIX + "get/",
  InvalidDtoIn: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CurrencyNotFound: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${Get.UC_CODE}currencyNotFound`;
      this.message = "Currency not found.";
    }
  }
};

const Update = {
  UC_CODE: ERROR_PREFIX + "update/",
  InvalidDtoIn: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CurrencyNotFoundToUpdate: class extends ReferencedataMainUseCaseError { // Specific for update scenario
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${Update.UC_CODE}currencyNotFoundToUpdate`;
      this.message = "Active currency to update not found.";
    }
  },
  CurrencyDaoUpdateFailed: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 500 }, paramMap, cause);
      this.code = `${Update.UC_CODE}currencyDaoUpdateFailed`;
      this.message = "Updating currency in DAO failed.";
    }
  }
};

const Archive = {
  UC_CODE: ERROR_PREFIX + "archive/",
  InvalidDtoIn: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${Archive.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CurrencyNotFoundToArchive: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 404 }, paramMap, cause);
      this.code = `${Archive.UC_CODE}currencyNotFoundToArchive`;
      this.message = "Active currency to archive not found.";
    }
  }
};

const ListCurrent = {
  UC_CODE: ERROR_PREFIX + "listCurrent/",
  InvalidDtoIn: class extends ReferencedataMainUseCaseError { // For pageInfo validation
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${ListCurrent.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const GetHistory = {
  UC_CODE: ERROR_PREFIX + "getHistory/",
  InvalidDtoIn: class extends ReferencedataMainUseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      super({ ...dtoOut, status: 400 }, paramMap, cause);
      this.code = `${GetHistory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  Create,
  Get,
  Update,
  Archive,
  ListCurrent,
  GetHistory
};
