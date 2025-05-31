
const currencyCreateDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(3, 3).isRequired(),
  name: uu5String(1, 255).isRequired(),
  validFrom: shape().dateTime().isRequired(),
  validTo: shape().dateTime()
});

const currencyGetDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(3, 3).isRequired()
});

const currencyUpdateDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(3, 3).isRequired(),
  name: uu5String(1, 255).isRequired(),
  validFrom: shape().dateTime()
});

const currencyArchiveDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(3, 3).isRequired()
});

const currencyListDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  pageIndex: shape().integer(0, null),
  pageSize: shape().integer(1, null)
});

const currencyGetHistoryDtoInType = shape({
  awid: uu5String(1, 255).isRequired(),
  isoCode: uu5String(3, 3).isRequired()
});
