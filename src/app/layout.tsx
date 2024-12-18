import type { Metadata } from "next";
import Head from "next/head";

import Providers from "@/providers";

import "./globals.css";
import { webFontClassName } from "./font";

export const metadata: Metadata = {
  title: "ABOUT ORG",
  description:
    "About ORG is information vault for you",
  keywords:
    "Information, ORG, organization, Sport, Music, Charity, Production, Movie, Community",
  generator:
    "Information, ORG, organization, Sport, Music, Charity, Production, Movie, Community",
  applicationName: "ABOUT ORG",
  openGraph: {
    images: [
      "https://admin-shwecharity-devv.s3.ap-southeast-1.amazonaws.com/uploads/1734527401501.png",
      "/uploads/images/logo/logo-1200x630.png"
    ]
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={webFontClassName}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
