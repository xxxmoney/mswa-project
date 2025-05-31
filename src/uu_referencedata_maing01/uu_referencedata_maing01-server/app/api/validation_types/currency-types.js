/* eslint-disable */

const currencyCreateDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(3, 3).isRequired(),
  name: shape().string(1, 255).isRequired(),
  validFrom: shape().dateTime(),
  validTo: shape().dateTime().nullable()
});

const currencyGetDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(3, 3).isRequired()
});

const currencyUpdateDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(3, 3).isRequired(),
  name: shape().string(1, 255).isRequired(),
  validFrom: shape().dateTime()
});

const currencyArchiveDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(3, 3).isRequired()
});

const currencyListDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  pageInfo: pageInfoDtoInType.isRequired().nullable()
});

const currencyGetHistoryDtoInType = shape({
  awid: shape().string(1, 255).isRequired(),
  isoCode: shape().string(3, 3).isRequired()
});
