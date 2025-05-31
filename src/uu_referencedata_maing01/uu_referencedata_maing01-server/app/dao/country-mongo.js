"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class CountryMongo extends UuObjectDao {
  async createSchema() {
    await this.createIndex({ awid: 1, isoCode: 1, validTo: 1 }, { unique: false });
    await this.createIndex({ awid: 1, isoCode: 1, validFrom: 1 }, { unique: false });
    await this.createIndex({ awid: 1, validTo: 1 });
    await this.createIndex({ awid: 1, currencyIsoCode: 1, validTo: 1 });
  }

  async create(awid, dtoIn) {
    const countryToInsert = {
      awid,
      isoCode: dtoIn.isoCode,
      name: dtoIn.name,
      currencyIsoCode: dtoIn.currencyIsoCode,
      validFrom: dtoIn.validFrom ? new Date(dtoIn.validFrom) : new Date(),
      validTo: dtoIn.validTo ? new Date(dtoIn.validTo) : null,
    };
    return await super.insertOne(countryToInsert);
  }

  async getCurrent(awid, isoCode) {
    return await super.findOne({ awid, isoCode, validTo: null });
  }

  async update(awid, isoCodeToUpdate, dtoIn) {
    const now = new Date();
    const newVersionValidFrom = dtoIn.validFrom ? new Date(dtoIn.validFrom) : now;

    const currentCountry = await super.findOne({ awid, isoCode: isoCodeToUpdate, validTo: null });

    if (!currentCountry) {
      return null;
    }

    let oldVersionValidTo = new Date(newVersionValidFrom.getTime() - 1); // TODO: why?
    if (oldVersionValidTo < currentCountry.validFrom) {
      oldVersionValidTo = newVersionValidFrom;
    }

    await super.findOneAndUpdate(
      { id: currentCountry.id, awid },
      { validTo: oldVersionValidTo },
      "NONE",
      null
    );

    const newCountryVersionData = {
      awid,
      isoCode: isoCodeToUpdate,
      name: dtoIn.name !== undefined ? dtoIn.name : currentCountry.name,
      currencyIsoCode: dtoIn.currencyIsoCode !== undefined ? dtoIn.currencyIsoCode : currentCountry.currencyIsoCode,
      validFrom: newVersionValidFrom,
      validTo: null,
    };
    return await super.insertOne(newCountryVersionData);
  }

  async archive(awid, isoCode) {
    const updatedDocument = await super.findOneAndUpdate(
      { awid, isoCode, validTo: null },
      { validTo: new Date() },
      "NONE",
      null
    );

    if (!updatedDocument) {
      const findResult = await super.find(
        { awid, isoCode, validTo: { $ne: null } },
        { pageIndex: 0, pageSize: 1 },
        { validTo: -1 },
        null
      );
      return findResult.itemList && findResult.itemList.length > 0 ? findResult.itemList[0] : null;
    }
    return updatedDocument;
  }

  async listCurrent(awid, pageInfo = {}) {
    const result = await super.find(
      { awid, validTo: null },
      pageInfo,
      null,
      null
    );
    return result.itemList;
  }

  async getHistory(awid, isoCode, pageInfo = {}) {
    const result = await super.find(
      { awid, isoCode },
      pageInfo,
      { validFrom: 1 }, // Ascending
      null
    );
    return result.itemList;
  }

  async listByCurrency(awid, currencyIsoCode, pageInfo = {}) {
    const result = await super.find(
      { awid, currencyIsoCode, validTo: null },
      pageInfo,
      null,
      null
    );
    return result.itemList;
  }
}

module.exports = CountryMongo;
