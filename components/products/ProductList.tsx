"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/products/SearchBar";
import { CategoryList } from "@/components/products/CategoryList";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    } else {
      setCategory("");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await res.json();
        setProducts(data);
        if (!category) {
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const res = await fetch(
          `https://fakestoreapi.com/products/category/${category}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch products by category");
        }
        const data: Product[] = await res.json();
        setFilteredProducts(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (category) {
      fetchProductsByCategory();
    } else {
      setFilteredProducts(products);
    }
  }, [category, products]);

  useEffect(() => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, category, products]);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 mb-4 md:mb-0">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CategoryList setCategory={setCategory} />
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} passHref>
                <div className="border p-4 rounded-xl shadow h-full flex flex-col">
                  <div className="relative w-full aspect-square mb-4">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-lg object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-semibold line-clamp-2 mb-2 flex-grow">
                    {product.title}
                  </h2>
                  <p className="text-gray-700 text-lg font-semibold text-right">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
