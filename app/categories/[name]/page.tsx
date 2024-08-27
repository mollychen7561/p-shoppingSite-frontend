"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const CategoryPage = () => {
  const pathname = usePathname();
  const categoryName = pathname.split("/").pop();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/category/${categoryName}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-xl shadow">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-60 object-contain mb-4"
            />
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <div className="flex justify-end">
              <p className="text-gray-700 text-lg font-semibold">
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
