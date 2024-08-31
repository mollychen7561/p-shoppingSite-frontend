"use client";

import { usePathname } from "next/navigation";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Spinner } from "@material-tailwind/react";
import Recommendation from "@/components/products/Recommendation";
import { ToastContainer, toast } from "react-toastify";
import { useUser } from "@/components/profile/UserContext";
import { useCart } from "@/components/products/CartProvider";
import { useFavoriteToggle } from "@/components/products/useFavoriteToggle";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const ProductPageContent = () => {
  const pathname = usePathname();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user, login } = useUser();
  const productId = parseInt(pathname.split("/").pop() || "0", 10);
  const [isFavorite, toggleFavorite] = useFavoriteToggle(productId);
  const { addToCart } = useCart();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      const id = pathname.split("/").pop();
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [pathname]);

  // Check for stored auth data
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth && !user) {
      const parsedAuth = JSON.parse(storedAuth);
      login(parsedAuth.user, parsedAuth.token);
    }
  }, [user, login]);

  useEffect(() => {}, [isFavorite]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  // Quantity management functions
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 20));
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
      setQuantity(value);
    }
  };

  // Add to cart function
  const handleAddToCart = async () => {
    if (!product) {
      toast.error("Unable to add to cart: Product not loaded");
      return;
    }

    try {
      const cartItem = {
        productId: product.id.toString(),
        name: product.title,
        price: product.price,
        quantity: quantity,
        image: product.image
      };

      await addToCart(cartItem);
      window.dispatchEvent(new Event("cartUpdate"));
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="rounded-lg overflow-hidden flex justify-center items-center h-[300px]">
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain max-w-full max-h-full hover:scale-125 transition duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <div className="bg-gray-100 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl text-blue-gray-500">$ {product.price}</p>
              <button
                className={`${isFavorite ? "text-red-500" : ""}`}
                onClick={() => toggleFavorite(product.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
            </div>

            {/* Quantity Selector and Add to Cart Button */}
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex items-center max-w-[8rem]">
                <button
                  type="button"
                  id="decrement-button"
                  onClick={decrementQuantity}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5"
                  placeholder="1"
                  required
                />
                <button
                  type="button"
                  id="increment-button"
                  onClick={incrementQuantity}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex items-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Add to Cart</span>
              </Button>
            </div>
            <p className="mt-4 font-light">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Recommendation productId={product.id} category={product.category} />
      </div>
    </div>
  );
};

const ProductPage = () => <ProductPageContent />;

export default ProductPage;
