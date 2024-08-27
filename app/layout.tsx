"use client";

import Head from "next/head";
import { Rubik } from "next/font/google";
import "../styles/globals.css";
import { MainNavbar } from "@/components/layout/MainNavBar";
import Footer from "@/components/layout/Footer";
import { UserProvider } from "@/components/profile/UserContext";
import { CartProvider } from "@/components/products/CartProvider";

const rubik = Rubik({ weight: "600", subsets: ["latin"] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.className}>
      <Head>
        <title>Shop App</title>
        <link rel="shortcut icon" href="./favicon.ico" />
      </Head>
      <body>
        <UserProvider>
          <CartProvider>
            <div id="alert-container"></div>
            <MainNavbar />
            <main>{children}</main>
          </CartProvider>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
