import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/component/clientProvider";
import Head from "next/head"; // Add this import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head> {/* This will now work */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
