import { geistMono, geistSans } from "@/styles/fonts";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
