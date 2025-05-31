/* eslint-disable */

const countryCreateDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(2, 3).isRequired(),
  name: shape().string(1, 255).isRequired(),
  currencyIsoCode: shape().string(3, 3).isRequired(),
  validFrom: shape().dateTime(),
  validTo: shape().dateTime().nullable()
});

const countryGetDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(2, 3).isRequired()
});

const countryUpdateDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(2, 3).isRequired(),
  name: shape().string(1, 255),
  currencyIsoCode: shape().string(3, 3),
  validFrom: shape().dateTime()
});

const countryArchiveDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(2, 3).isRequired()
});

const countryListDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  pageInfo: pageInfoDtoInType.isRequired().nullable()
});

const countryGetHistoryDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(2, 3).isRequired()
});

const countryListByCurrencyDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  currencyIsoCode: shape().string(3, 3).isRequired(),
  pageInfo: pageInfoDtoInType.isRequired().nullable()
});
