/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * MSWA Project API
 * API for managing currencies and countries with versioning support
 * OpenAPI spec version: 1.0.0
 */

export type PageInfo = {
    /**
     * Current page index (0-based)
     * @minimum 0
     */
    pageIndex?: number;
    /**
     * Number of items per page
     * @minimum 1
     * @maximum 100
     */
    pageSize?: number;
};
