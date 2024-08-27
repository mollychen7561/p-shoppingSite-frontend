import React from "react";
import type { AppProps } from "next/app";
import { UserProvider } from "@/components/profile/UserContext";
import { CartProvider } from "@/components/products/CartProvider";
import axios from "axios";

axios.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

axios.interceptors.response.use(
  (response) => {
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.log("Response Error:", error.response?.data);
    return Promise.reject(error);
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </UserProvider>
  );
}

export default MyApp;
