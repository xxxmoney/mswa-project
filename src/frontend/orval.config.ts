import { defineConfig } from 'orval';

import openapi from './src/modules/api/config/openapi.json';

const outputDir = './src/modules/api/codegen';

const config = defineConfig({
    api: {
        input: {
            target: openapi,
        },
        output: {
            mode: 'single',
            client: 'react-query',
            target: outputDir + '/endpoints.ts',
            schemas: outputDir + '/model',
            mock: false,
            prettier: false,
            clean: true,
            tsconfig: './tsconfig.json',
            packageJson: './package.json',
            override: {
                useBigInt: true,
                useNamedParameters: true,
                useNativeEnums: false,
                useTypeOverInterfaces: true,
                mutator: {
                    path: './src/modules/api/config/fetcher.ts',
                    name: 'fetcher',
                },
            },
        },
    },
});

export default config;
