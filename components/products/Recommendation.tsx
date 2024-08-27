"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Recommendation = ({ productId, category }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch recommended products based on category
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/category/${category}`
        );
        // Filter out the current product from recommendations
        const data = response.data.filter(
          (product) => product.id !== productId
        );
        setRecommendedProducts(data);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, [productId, category]);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.ceil(recommendedProducts.length / 3) - 1
        ? 0
        : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.ceil(recommendedProducts.length / 3) - 1
        : prevIndex - 1
    );
  };

  // Display products for current slide
  const displayedProducts = () => {
    const startIndex = currentIndex * 3;
    return recommendedProducts.slice(startIndex, startIndex + 3);
  };

  // Render static layout for 3 or fewer products
  if (recommendedProducts.length <= 3) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
        <div className="flex space-x-4">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 p-4 w-1/3">
              <Link href={`/products/${product.id}`} passHref>
                <div className="border p-4 rounded-xl shadow cursor-pointer">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="w-full h-60 object-contain mb-4"
                    width={500}
                    height={500}
                  />
                  <h2 className="text-xl font-semibold line-clamp-1">
                    {product.title}
                  </h2>
                  <div className="flex justify-end">
                    <p className="text-gray-700 text-lg font-semibold">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render carousel for more than 3 products
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${recommendedProducts.length * (60 / 3)}%`
          }}
        >
          {recommendedProducts.map((product) => (
            <div key={product.id} className="w-1/3 flex-shrink-0 p-4">
              <Link href={`/products/${product.id}`} passHref>
                <div className="border p-4 rounded-xl shadow cursor-pointer">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="w-full h-60 object-contain mb-4"
                    width={500}
                    height={500}
                  />
                  <h2 className="text-xl font-semibold line-clamp-1">
                    {product.title}
                  </h2>
                  <div className="flex justify-end">
                    <p className="text-gray-700 text-lg font-semibold">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Navigation buttons */}
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-500/50 hover:bg-gray-500/80 text-white px-3 py-1 rounded-full"
          onClick={prevSlide}
        >
          &lt;
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-500/50 hover:bg-gray-500/80 text-white px-3 py-1 rounded-full"
          onClick={nextSlide}
        >
          &gt;
        </button>
      </div>
      {/* Pagination indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(recommendedProducts.length / 3) }).map(
          (_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Recommendation;
