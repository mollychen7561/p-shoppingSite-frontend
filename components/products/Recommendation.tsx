"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@material-tailwind/react";

const Recommendation = ({ productId, category }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/category/${category}`
        );
        const data = await response.json();
        setRecommendedProducts(
          data.filter((product) => product.id !== productId)
        );
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [productId, category]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(recommendedProducts.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const ProductCard = ({ product }) => {
    if (!product) return null;

    return (
      <div className="w-full flex-shrink-0 px-2">
        <Link href={`/products/${product.id}`}>
          <div className="border rounded-lg shadow p-4 h-full flex flex-col">
            <div className="relative w-full pt-[100%] mb-2">
              <Image
                src={product.image}
                alt={product.title}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h2 className="text-sm font-semibold line-clamp-2 mb-2 h-10">
              {product.title}
            </h2>
            <p className="text-gray-700 text-base font-semibold">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  const displayProducts = recommendedProducts.slice(
    currentPage * itemsPerSlide,
    (currentPage + 1) * itemsPerSlide
  );

  return (
    <div className="mt-8 max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner className="h-12 w-12" />
        </div>
      ) : recommendedProducts.length > 0 ? (
        <div className="relative overflow-hidden">
          <div className="flex">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                style={{ width: `${100 / itemsPerSlide}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {recommendedProducts.length > itemsPerSlide && (
            <>
              <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-500/50 hover:bg-gray-500/80 text-white px-2 py-1 rounded-full z-10"
                onClick={prevSlide}
              >
                &lt;
              </button>
              <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-500/50 hover:bg-gray-500/80 text-white px-2 py-1 rounded-full z-10"
                onClick={nextSlide}
              >
                &gt;
              </button>
            </>
          )}
        </div>
      ) : (
        <p>No recommended products available.</p>
      )}
      {/* Pagination indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentPage === index ? "bg-gray-800" : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;
