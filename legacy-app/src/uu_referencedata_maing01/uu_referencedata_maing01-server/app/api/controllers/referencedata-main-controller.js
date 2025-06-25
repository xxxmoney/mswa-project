"use strict";
const ReferencedataMainAbl = require("legacy-app/src/uu_referencedata_maing01/uu_referencedata_maing01-server/app/abl/referencedata-main-abl.js");

class ReferencedataMainController {
  init(ucEnv) {
    return ReferencedataMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return ReferencedataMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return ReferencedataMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new ReferencedataMainController();
