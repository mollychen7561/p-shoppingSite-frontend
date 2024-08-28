"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/profile/UserContext";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";
import { userApi } from "@/app/lib/api/userApi";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const WishlistPage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useUser();

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !token) {
        setIsLoading(false);
        setError("Please login to view your wishlist");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Get favorite product IDs
        const favoriteIds = await userApi.getFavorites(token);

        // Fetch details for each favorite product
        const productPromises = favoriteIds.map((id: number) =>
          fetch(`https://fakestoreapi.com/products/${id}`).then((res) =>
            res.json()
          )
        );

        const favoriteProducts = await Promise.all(productPromises);

        setFavorites(favoriteProducts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Failed to load wishlist");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  // Remove a product from favorites
  const removeFavorite = async (productId: number) => {
    try {
      await userApi.removeFavorite(token, productId);
      setFavorites(favorites.filter((product) => product.id !== productId));
      toast.success("Product removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove product from wishlist");
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {favorites.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.title || "Product image"}
                  layout="fill"
                  objectFit="contain"
                  className="hover:opacity-75 transition-opacity duration-300"
                />
              </div>
              <h2 className="text-lg font-semibold truncate">
                {product.title || "Untitled Product"}
              </h2>
              <p className="text-blue-gray-500 mt-2">
                ${product.price?.toFixed(2) ?? "N/A"}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  href={`/products/${product.id}`}
                  className="text-gray-600"
                >
                  View Product ➜
                </Link>
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="text-red-300 hover:underline"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
