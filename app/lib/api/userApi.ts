// app/lib/api/userApi.ts

import { API_BASE_URL } from "@/app/config/api";

class UserApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        }
      });

      // console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: any) {
    try {
      const result = await this.request("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: any) {
    try {
      const result = await this.request("/users/register", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      return result;
    } catch (error) {
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
