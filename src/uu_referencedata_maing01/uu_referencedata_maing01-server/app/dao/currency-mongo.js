"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class CurrencyMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, isoCode: 1, validTo: 1 }, { unique: false });
    await super.createIndex({ awid: 1, isoCode: 1, validFrom: 1 }, { unique: false });
    await super.createIndex({ awid: 1, validTo: 1 });
  }

  async create(awid, dtoIn) {
    const currencyToInsert = {
      awid,
      isoCode: dtoIn.isoCode,
      name: dtoIn.name,
      validFrom: dtoIn.validFrom ? new Date(dtoIn.validFrom) : new Date(),
      validTo: dtoIn.validTo ? new Date(dtoIn.validTo) : null,
    };
    return await super.insertOne(currencyToInsert);
  }

  async getCurrent(awid, isoCode) {
    // super.findOne handles _id conversion and returns object with 'id' instead of '_id'
    return await super.findOne({ awid, isoCode, validTo: null });
  }

  async update(awid, isoCodeToUpdate, dtoIn) {
    const now = new Date();
    const newVersionValidFrom = dtoIn.validFrom ? new Date(dtoIn.validFrom) : now;

    const currentCurrency = await super.findOne({ awid, isoCode: isoCodeToUpdate, validTo: null });

    if (!currentCurrency) {
      return null;
    }

    let oldVersionValidTo = new Date(newVersionValidFrom.getTime() - 1); // TODO: why?
    if (oldVersionValidTo < currentCurrency.validFrom) {
      oldVersionValidTo = newVersionValidFrom;
    }

    await super.findOneAndUpdate(
      { id: currentCurrency.id, awid },
      { validTo: oldVersionValidTo },
      "NONE",
      null
    );

    const newCurrencyVersionData = {
      awid,
      isoCode: isoCodeToUpdate,
      name: dtoIn.name || currentCurrency.name,
      validFrom: newVersionValidFrom,
      validTo: null,
    };
    return await super.insertOne(newCurrencyVersionData);
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
        { validTo: -1 }, // Descending
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
}

module.exports = CurrencyMongo;
