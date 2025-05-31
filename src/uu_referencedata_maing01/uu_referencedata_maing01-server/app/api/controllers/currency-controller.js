// File: app/api/controllers/currency-controller.js
"use strict";
const CurrencyAbl = require("../../abl/currency-abl.js");

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
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.create(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: currency/get
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async get(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.get(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: currency/update
   * Expected HTTP Method: POST (or PUT)
   * Profile: Authorities
   */
  async update(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.update(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: currency/archive
   * Expected HTTP Method: POST (or DELETE)
   * Profile: Authorities
   */
  async archive(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.archive(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: currency/listCurrent
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async listCurrent(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.listCurrent(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }

  /**
   * Corresponds to command: currency/getHistory
   * Expected HTTP Method: GET
   * Profile: Readers, Authorities
   */
  async getHistory(ucEnv) {
    const { awid, dtoIn, session, authorizationResult } = ucEnv;
    const dtoOut = await this.abl.getHistory(awid, dtoIn, session, authorizationResult);
    ucEnv.res.json(dtoOut);
  }
}

module.exports = new CurrencyController();
