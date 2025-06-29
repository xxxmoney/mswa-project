/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * MSWA Project API
 * API for managing currencies and countries with versioning support
 * OpenAPI spec version: 1.0.0
 */

export type CreateCountryRequest = {
    /**
     * 2-letter ISO country code
     * @pattern ^[A-Z]{2}$
     */
    isoCode: string;
    /**
     * Country name
     * @minLength 1
     * @maxLength 100
     */
    name: string;
    /**
     * ISO code of the currency used by this country
     * @pattern ^[A-Z]{3}$
     */
    currencyIsoCode: string;
    /** Date from which this country is valid */
    validFrom?: string;
    /** Date until which this country is valid */
    validTo?: string;
};
