import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useUser } from "@/components/profile/UserContext";
import { userApi } from "@/app/lib/api/userApi";

export const useFavoriteToggle = (productId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, token } = useUser();

  const checkIfFavorite = useCallback(async () => {
    if (!user || !token || !productId) return;

    try {
      const favorites = await userApi.getFavorites(token);
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
      if (isFavorite) {
        await userApi.removeFavorite(token, productId);
      } else {
        await userApi.addFavorite(token, productId);
      }

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
