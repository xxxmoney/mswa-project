"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class CountryMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, isoCode: 1, validTo: 1 }, { unique: false });
    await super.createIndex({ awid: 1, isoCode: 1, validFrom: 1 }, { unique: false });
    await super.createIndex({ awid: 1, validTo: 1});
  }

  async create(awid, dtoIn) {
    const country = {
      awid,
      isoCode: dtoIn.isoCode,
      name: dtoIn.name,
      currencyIsoCode: dtoIn.currencyIsoCode,
      validFrom: dtoIn.validFrom ? new Date(dtoIn.validFrom) : new Date(),
      validTo: dtoIn.validTo ? new Date(dtoIn.validTo) : null,
    };
    return await super.insertOne(country);
  }

  async getCurrent(awid, isoCode) {
    return await super.findOne({ awid, isoCode, validTo: null });
  }

  async update(awid, isoCodeToUpdate, dtoIn) {
    const now = new Date();
    const newVersionValidFrom = dtoIn.validFrom ? new Date(dtoIn.validFrom) : now;

    const currentCountry = await super.findOne({ awid, isoCode: isoCodeToUpdate, validTo: null });

    if (currentCountry) {
      let oldVersionValidTo = new Date(newVersionValidFrom.getTime() - 1);
      if (oldVersionValidTo < currentCountry.validFrom) {
        oldVersionValidTo = newVersionValidFrom;
      }
      await super.updateOne(
        { _id: currentCountry._id },
        { $set: { validTo: oldVersionValidTo } }
      );
    }

    const newCountryVersion = {
      awid,
      isoCode: isoCodeToUpdate,
      name: dtoIn.name !== undefined ? dtoIn.name : (currentCountry ? currentCountry.name : "Unknown Name"),
      currencyIsoCode: dtoIn.currencyIsoCode !== undefined ? dtoIn.currencyIsoCode : (currentCountry ? currentCountry.currencyIsoCode : "UnknownCurrency"),
      validFrom: newVersionValidFrom,
      validTo: null,
    };
    return await super.insertOne(newCountryVersion);
  }

  async archive(awid, isoCode) {
    const result = await super.updateOne(
      { awid, isoCode, validTo: null },
      { $set: { validTo: new Date() } }
    );

    // If updated successfully
    if (result.modifiedCount === 1) {
      // $ne - not equal
      const archivedDoc = await super.find({awid, isoCode, validTo: {$ne: null}}).sort({validTo: -1}).limit(1).toArray();
      return archivedDoc.length > 0 ? archivedDoc[0] : null;
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

  async listByCurrency(awid, currencyIsoCode, pageInfo = {}) {
    const { pageIndex = 0, pageSize = 100 } = pageInfo;
    return await super.find({ awid, currencyIsoCode, validTo: null })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  }
}

module.exports = CountryMongo;
