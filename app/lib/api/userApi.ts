// app/lib/api/userApi.ts

import { API_BASE_URL } from "@/app/config/api";

class UserApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Starting request to: ${url}`, options);

    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        }
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `API Error: ${response.status} ${response.statusText}`,
          errorBody
        );
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }

  async login(credentials: any) {
    console.log("Attempting login with credentials:", {
      email: credentials.email,
      password: "********"
    });
    try {
      const result = await this.request("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      console.log("Login successful:", result);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async register(userData: any) {
    console.log("Attempting to register user:", {
      ...userData,
      password: "********"
    });
    try {
      const result = await this.request("/users/register", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      console.log("Registration successful:", result);
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async getProfile(token: string) {
    return this.request("/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async getCart(token: string) {
    return this.request("/users/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async addToCart(token: string, productData: any) {
    return this.request("/users/cart", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(productData)
    });
  }

  async updateCart(token: string, cartData: any) {
    return this.request("/users/cart", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(cartData)
    });
  }

  async removeFromCart(token: string, productId: string) {
    return this.request(`/users/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async updateCartItem(token: string, productId: string, updateData: any) {
    return this.request(`/users/cart/${productId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updateData)
    });
  }

  async clearCart(token: string) {
    return this.request("/users/cart", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async mergeCart(token: string, cartData: any) {
    return this.request("/users/merge-cart", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(cartData)
    });
  }

  async addFavorite(token: string, productId: string) {
    return this.request("/users/favorites/add", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId })
    });
  }

  async removeFavorite(token: string, productId: string) {
    return this.request("/users/favorites/remove", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId })
    });
  }

  async getFavorites(token: string) {
    return this.request("/users/favorites", {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async createOrder(token: string, orderData: any) {
    return this.request("/users/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(token: string) {
    return this.request("/users/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

export const userApi = new UserApi(API_BASE_URL);
