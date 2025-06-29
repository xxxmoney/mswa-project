/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * MSWA Project API
 * API for managing currencies and countries with versioning support
 * OpenAPI spec version: 1.0.0
 */

export type Currency = {
    /** Unique identifier for the currency */
    id: string;
    /**
     * 3-letter ISO currency code
     * @pattern ^[A-Z]{3}$
     */
    isoCode: string;
    /**
     * Currency name
     * @maxLength 100
     */
    name: string;
    /**
     * Currency symbol
     * @maxLength 10
     */
    symbol?: string;
    /** Version number */
    version: number;
    /** Whether this is the current active version */
    isCurrent: boolean;
    /** Date from which this version is valid */
    validFrom: string;
    /**
     * Date until which this version is valid (null if currently active)
     * @nullable
     */
    validTo?: string | null;
    /** Creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
};
