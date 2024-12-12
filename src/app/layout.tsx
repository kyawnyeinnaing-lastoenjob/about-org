import type { Metadata } from "next";
import Head from "next/head";

import Providers from "@/providers";

import { poppins } from "./font";

import "./globals.css";

export const metadata: Metadata = {
  title: "Shwe Charity",
  description:
    "Shwe Charity right away. There will be everything you need Shwe Charity.",
  keywords:
    "charity, Donation, Help, Need, Resources , Places, Support, People, Country, Townships, Regions",
  generator:
    "charity, Donation, Help, Need, Resources , Places, Support, People, Country, Townships, Regions",
  applicationName: "Shwe Charity",
  openGraph: {
    images: [
      "https://shwecharity-production.s3.ap-southeast-1.amazonaws.com/SEO+image.png",
      "/uploads/images/logo/logo-1200x630.png",
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
