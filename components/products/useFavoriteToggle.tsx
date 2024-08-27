import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@/components/profile/UserContext";

export const useFavoriteToggle = (productId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, token } = useUser();

  const checkIfFavorite = useCallback(async () => {
    if (!user || !token || !productId) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const favorites = response.data.favorites;
      setIsFavorite(favorites.includes(productId));
    } catch (error) {
      toast.error("Error checking favorite status");
    }
  }, [user, token, productId]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const toggleFavorite = async () => {
    if (!user || !token) {
      toast.error("Please login to manage favorites");
      return;
    }

    try {
      const endpoint = isFavorite ? "remove" : "add";
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites/${endpoint}`,
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite
          ? "Product removed from favorites"
          : "Product added to favorites"
      );
    } catch (error) {
      toast.error("Error managing favorites");
    }
  };

  return [isFavorite, toggleFavorite] as const;
};
