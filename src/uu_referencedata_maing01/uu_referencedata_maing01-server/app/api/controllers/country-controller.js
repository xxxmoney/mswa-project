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
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.create(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: country/get
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async get(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.get(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: country/update
   * Expected HTTP Method: POST (or PUT)
   * Profile: Authorities
   */
  async update(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.update(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: country/archive
   * Expected HTTP Method: POST (or DELETE)
   * Profile: Authorities
   */
  async archive(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.archive(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: country/listCurrent
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async listCurrent(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.listCurrent(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: country/getHistory
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async getHistory(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.getHistory(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: country/listByCurrency
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async listByCurrency(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.listByCurrency(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }
}

module.exports = new CountryController();
