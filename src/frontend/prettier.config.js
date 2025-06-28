const generateImportOrder = groups => {
    const result = [];
    const groupBreak = '';

    for (const group of groups) {
        result.push(...group, groupBreak);
    }

    return result;
};

/**
 * @type {import('@ianvs/prettier-plugin-sort-imports').PrettierConfig}
 */
const config = {
    singleQuote: true,
    jsxSingleQuote: true,
    semi: true,
    arrowParens: 'avoid',
    printWidth: 120,
    tabWidth: 4,
    trailingComma: 'all',

    plugins: [require.resolve('@ianvs/prettier-plugin-sort-imports')],
    importOrder: generateImportOrder([
        ['^(react/(.*)$)|^(react$)|^(react-native(.*)$)', '<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>'],
        ['^@/(.*)$'],
        ['^[../]', '^[./]'],
    ]),

    /**
     * >=5.x
     */
    importOrderTypeScriptVersion: '5.0.0',
};

module.exports = config;
