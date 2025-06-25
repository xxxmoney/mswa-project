// File: app/api/controllers/currency-controller.js
"use strict";
const CurrencyAbl = require("legacy-app/src/uu_referencedata_maing01/uu_referencedata_maing01-server/app/abl/currency-abl.js");

class CurrencyController {
  constructor() {
    this.abl = CurrencyAbl;
  }

  /**
   * Corresponds to command: currency/create
   * Expected HTTP Method: POST
   * Profile: Authorities
   */
  async create(ucEnv) {
    return await this.abl.create(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: currency/get
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async get(ucEnv) {
    return await this.abl.get(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: currency/update
   * Expected HTTP Method: POST (or PUT)
   * Profile: Authorities
   */
  async update(ucEnv) {
    return await this.abl.update(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: currency/archive
   * Expected HTTP Method: POST (or DELETE)
   * Profile: Authorities
   */
  async archive(ucEnv) {
    return await this.abl.archive(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: currency/listCurrent
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async listCurrent(ucEnv) {
    return await this.abl.listCurrent(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: currency/getHistory
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async getHistory(ucEnv) {
    return await this.abl.getHistory(ucEnv.getDtoIn());
  }
}

module.exports = new CurrencyController();
