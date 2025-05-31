"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { AppModelError } = require("uu_appg01_server").Error; // For custom errors if needed

class CurrencyMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, isoCode: 1, validTo: 1 }, { unique: false });
    await super.createIndex({ awid: 1, isoCode: 1, validFrom: 1 }, { unique: false });
    await super.createIndex({ awid: 1, validTo: 1 });
  }

  async create(awid, dtoIn) {
    const currency = {
      awid,
      isoCode: dtoIn.isoCode,
      name: dtoIn.name,
      validFrom: dtoIn.validFrom ? new Date(dtoIn.validFrom) : new Date(),
      validTo: dtoIn.validTo ? new Date(dtoIn.validTo) : null,
    };
    return await super.insertOne(currency);
  }

  async getCurrent(awid, isoCode) {
    return await super.findOne({ awid, isoCode, validTo: null });
  }

  async update(awid, isoCodeToUpdate, dtoIn) {
    const now = new Date();
    const newVersionValidFrom = dtoIn.validFrom ? new Date(dtoIn.validFrom) : now;

    const currentCurrency = await super.findOne({ awid, isoCode: isoCodeToUpdate, validTo: null });

    if (currentCurrency) {
      let oldVersionValidTo = new Date(newVersionValidFrom.getTime() - 1); // Ends 1ms before new one starts
      if (oldVersionValidTo < currentCurrency.validFrom) {
        oldVersionValidTo = newVersionValidFrom;
      }

      await super.updateOne(
        { _id: currentCurrency._id },
        { $set: { validTo: oldVersionValidTo } }
      );
    }

    // Create the new version
    const newCurrencyVersion = {
      awid,
      isoCode: isoCodeToUpdate,
      name: dtoIn.name || (currentCurrency ? currentCurrency.name : "Unknown"),
      validFrom: newVersionValidFrom,
      validTo: null,
    };
    return await super.insertOne(newCurrencyVersion);
  }

  async archive(awid, isoCode) {
    const result = await super.updateOne(
      { awid, isoCode, validTo: null },
      { $set: { validTo: new Date() } }
    );

    // If updated successfully
    if (result.modifiedCount === 1) {
      // $ne - not equal
      return await super.findOne({awid, isoCode, validTo: {$ne: null}, $orderby: {validTo: -1}});
    }

    return null;
  }

  async listCurrent(awid, pageInfo = {}) {
    const { pageIndex = 0, pageSize = 100 } = pageInfo;
    return await super.find({ awid, validTo: null })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  }

  async getHistory(awid, isoCode) {
    return await super.find({ awid, isoCode })
      .sort({ validFrom: 1 }) // Ascending, oldest first
      .toArray();
  }
}

module.exports = new CurrencyMongo();
