import { Head, Html, Main, NextScript } from 'next/document';

import { geistMono, geistSans } from '@/styles/fonts';

export default function Document() {
    return (
        <Html lang='en'>
            <Head />
            <body className={`antialiased ${geistSans.variable} ${geistMono.variable}`}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
