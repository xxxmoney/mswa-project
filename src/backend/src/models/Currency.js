const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const currencySchema = new mongoose.Schema({
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
  validFrom: {
    type: Date,
    default: Date.now,
    required: true
  },
  validTo: {
    type: Date,
    default: null
  },
  symbol: {
    type: String,
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
currencySchema.index({ isoCode: 1, validTo: 1 });
currencySchema.index({ isoCode: 1, validFrom: 1 });
currencySchema.index({ validTo: 1 });

// Virtual for checking if record is current (not archived)
currencySchema.virtual('isCurrent').get(function() {
  return this.validTo === null;
});

// Static method to get current version of a currency
currencySchema.statics.getCurrent = function(isoCode) {
  return this.findOne({ isoCode, validTo: null });
};

currencySchema.statics.getByIsoCode = async function(isoCode) {
  return this.findOne({ isoCode });
};

currencySchema.statics.getActiveByIsoCode = async function(isoCode) {
  return this.findOne({ isoCode, validTo: null });
};

// Static method to list current currencies
currencySchema.statics.listCurrent = async function(pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  const currencies = await this.find()
    .sort({ validTo: -1 })
    .skip(skip)
    .limit(pageSize);

  const activeCurrencies = await this.find({ validTo: null });

  const currenciesByIsoCode = currencies.reduce((acc, currency) => {
    if (activeCurrencies.some(activeCurrency => activeCurrency.isoCode === currency.isoCode)) {
      acc[currency.isoCode] = currency;

      return acc;
    }

    if (acc[currency.isoCode]) {
      return acc;
    }

    acc[currency.isoCode] = currency;
    return acc;
  }, {});

  return Object.values(currenciesByIsoCode).sort((a, b) => {
    if (!a.validTo) return -1
  });
};

// Static method to get history of a currency
currencySchema.statics.getHistory = function(isoCode, pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  return this.find({ isoCode })
    .sort({ validFrom: -1 })
    .skip(skip)
    .limit(pageSize);
};

// Static method to update a currency (creates new version)
currencySchema.statics.updateCurrency = async function(isoCode, updateData) {
  const now = new Date();
  const newVersionValidFrom = updateData.validFrom ? new Date(updateData.validFrom) : now;

  // Get current version
  const currentCurrency = await this.findOne({ isoCode, validTo: null });
  if (!currentCurrency) {
    return null;
  }

  // Set end date for current version
  let oldVersionValidTo = new Date(newVersionValidFrom.getTime() - 1);
  if (oldVersionValidTo < currentCurrency.validFrom) {
    oldVersionValidTo = newVersionValidFrom;
  }

  // Archive current version
  await this.findByIdAndUpdate(currentCurrency._id, { validTo: oldVersionValidTo });

  // Create new version
  const newCurrencyData = {
    isoCode,
    name: updateData.name || currentCurrency.name,
    validFrom: newVersionValidFrom,
    validTo: null
  };

  return await this.create(newCurrencyData);
};

// Static method to archive a currency
currencySchema.statics.archiveCurrency = async function(isoCode) {
  const updatedDocument = await this.findOneAndUpdate(
    { isoCode, validTo: null },
    { validTo: new Date() },
    { new: true }
  );

  if (!updatedDocument) {
    // If no current version found, return the most recent archived version
    const findResult = await this.find(
      { isoCode },
      null,
      { sort: { validTo: -1 }, limit: 1 }
    );
    return findResult.length > 0 ? findResult[0] : null;
  }

  return updatedDocument;
};

currencySchema.statics.createCurrency = async function(data) {
  const activeCurrency = await this.find({ isoCode: data.isoCode, validTo: null });

  if (activeCurrency) {
    throw new Error(`Currency with iso code ${data.isoCode} already exists and is active.`);
  }

  const existingCurrency = await this.findOne({ isoCode: data.isoCode }, null, { sort: { validTo: -1 }, limit: 1 });

  if (existingCurrency) {
    data.version = (existingCurrency.version || 0) + 1;
  }

  return await this.create(data);
};

module.exports = mongoose.model('Currency', currencySchema); 