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
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/4 p-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CategoryList setCategory={setCategory} />
      </div>
      <div className="md:w-3/4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} passHref>
              <div className="border p-4 rounded-xl shadow">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
