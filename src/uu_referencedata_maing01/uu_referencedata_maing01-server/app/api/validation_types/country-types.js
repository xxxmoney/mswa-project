
const countryCreateDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(2, 3).isRequired(),
  name: uu5String(1, 255).isRequired(),
  currencyIsoCode: uu5String(3, 3).isRequired(),
});

const countryGetDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(2, 3).isRequired()
});

const countryUpdateDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(2, 3).isRequired(),
  name: uu5String(1, 255),
  currencyIsoCode: uu5String(3, 3),
});

const countryArchiveDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(2, 3).isRequired()
});

const countryListDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  pageIndex: shape().integer(0, null),
  pageSize: shape().integer(1, null)
});

const countryGetHistoryDtoInType = shape({
  awid: uu5String(255).isRequired(),
  isoCode: uu5String(2, 3).isRequired()
});

const countryListByCurrencyDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  currencyIsoCode: uu5String(3, 3).isRequired(),
  pageIndex: shape().integer(0, null),
  pageSize: shape().integer(1, null)
});
