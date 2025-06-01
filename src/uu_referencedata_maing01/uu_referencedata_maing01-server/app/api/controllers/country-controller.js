// File: app/api/controllers/country-controller.js
"use strict";
const CountryAbl = require("../../abl/country-abl.js");

class CountryController {
  constructor() {
    this.abl = CountryAbl;
  }

  /**
   * Corresponds to command: country/create
   * Expected HTTP Method: POST
   * Profile: Authorities
   */
  async create(ucEnv) {
    return await this.abl.create(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: country/get
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async get(ucEnv) {
    return await this.abl.get(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: country/update
   * Expected HTTP Method: POST (or PUT)
   * Profile: Authorities
   */
  async update(ucEnv) {
    return await this.abl.update(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: country/archive
   * Expected HTTP Method: POST (or DELETE)
   * Profile: Authorities
   */
  async archive(ucEnv) {
    return await this.abl.archive(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: country/listCurrent
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async listCurrent(ucEnv) {
    return await this.abl.listCurrent(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: country/getHistory
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async getHistory(ucEnv) {
    return await this.abl.getHistory(ucEnv.getDtoIn());
  }

  /**
   * Corresponds to command: country/listByCurrency
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async listByCurrency(ucEnv) {
    return await this.abl.listByCurrency(ucEnv.getDtoIn());
  }
}

module.exports = new CountryController();
