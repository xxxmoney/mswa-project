const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const countrySchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    required: true,
    unique: true,
    index: true
  },
  isoCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  currencyIsoCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  validFrom: {
    type: Date,
    default: Date.now,
    required: true
  },
  validTo: {
    type: Date,
    default: null
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient querying
countrySchema.index({ isoCode: 1, validTo: 1 });
countrySchema.index({ isoCode: 1, validFrom: 1 });
countrySchema.index({ validTo: 1 });
countrySchema.index({ currencyIsoCode: 1, validTo: 1 });

// Virtual for checking if record is current (not archived)
countrySchema.virtual('isCurrent').get(function() {
  return this.validTo === null;
});

// Static method to get current version of a country
countrySchema.statics.getCurrent = function(isoCode) {
  return this.findOne({ isoCode, validTo: null });
};

// Static method to list current countries
countrySchema.statics.listCurrent = function(pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  return this.find({ validTo: null })
    .sort({ name: 1 })
    .skip(skip)
    .limit(pageSize);
};

// Static method to get history of a country
countrySchema.statics.getHistory = function(isoCode, pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  return this.find({ isoCode })
    .sort({ validFrom: 1 })
    .skip(skip)
    .limit(pageSize);
};

// Static method to list countries by currency
countrySchema.statics.listByCurrency = function(currencyIsoCode, pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  return this.find({ currencyIsoCode, validTo: null })
    .sort({ name: 1 })
    .skip(skip)
    .limit(pageSize);
};

countrySchema.statics.getByCurrencyIsoCode = function(currencyIsoCode) {
  return this.findOne({ currencyIsoCode, validTo: null });
};

// Static method to update a country (creates new version)
countrySchema.statics.updateCountry = async function(isoCode, updateData) {
  const now = new Date();
  const newVersionValidFrom = updateData.validFrom ? new Date(updateData.validFrom) : now;

  // Get current version
  const currentCountry = await this.findOne({ isoCode, validTo: null });
  if (!currentCountry) {
    return null;
  }

  // Set end date for current version
  let oldVersionValidTo = new Date(newVersionValidFrom.getTime() - 1);
  if (oldVersionValidTo < currentCountry.validFrom) {
    oldVersionValidTo = newVersionValidFrom;
  }

  // Archive current version
  await this.findByIdAndUpdate(currentCountry._id, { validTo: oldVersionValidTo });

  // Create new version
  const newCountryData = {
    isoCode,
    name: updateData.name !== undefined ? updateData.name : currentCountry.name,
    currencyIsoCode: updateData.currencyIsoCode !== undefined ? updateData.currencyIsoCode : currentCountry.currencyIsoCode,
    validFrom: newVersionValidFrom,
    validTo: null
  };

  return await this.create(newCountryData);
};

// Static method to archive a country
countrySchema.statics.archiveCountry = async function(isoCode) {
  const updatedDocument = await this.findOneAndUpdate(
    { isoCode, validTo: null },
    { validTo: new Date() },
    { new: true }
  );

  if (!updatedDocument) {
    // If no current version found, return the most recent archived version
    const findResult = await this.find(
      { isoCode, validTo: { $ne: null } },
      null,
      { sort: { validTo: -1 }, limit: 1 }
    );
    return findResult.length > 0 ? findResult[0] : null;
  }

  return updatedDocument;
};

countrySchema.statics.createCountry = async function(data) {
  const existingCountry = await this.findOne({ isoCode: data.isoCode }, null, { sort: { validTo: -1 }, limit: 1 });

  if (existingCountry) {
    data.version = (existingCountry.version || 0) + 1;
  }

  return await this.create(data);
};

module.exports = mongoose.model('Country', countrySchema); 