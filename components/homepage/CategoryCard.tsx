"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button
} from "@material-tailwind/react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export default function CategoryCard() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/categories"
        );
        const data = await response.json();

        const categoriesWithImages = await Promise.all(
          data.map(async (name: string, index: number) => {
            const productsResponse = await fetch(
              `https://fakestoreapi.com/products/category/${name}?limit=2`
            );
            const products = await productsResponse.json();
            const imageUrl = products[1]?.image || "";

            return {
              id: index,
              name,
              imageUrl
            };
          })
        );

        setCategories(categoriesWithImages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mx-auto my-5 w-10/12">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            shadow={false}
            className="relative flex h-[20rem] w-full flex-col items-center justify-between text-center overflow-hidden"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center p-8"
              style={{
                backgroundImage: `url(${category.imageUrl})`,
                backgroundSize: "80%",
                backgroundRepeat: "no-repeat",
                transform: "scale(0.9)"
              }}
            >
              <div className="absolute inset-0 h-full w-full bg-black/50 rounded-lg" />
            </CardHeader>
            <CardBody className="relative flex flex-col items-center justify-center p-6 z-10">
              <Typography
                variant="h2"
                color="white"
                className="font-medium leading-[1.5]"
              >
                {category.name}
              </Typography>
            </CardBody>
            <CardFooter className="relative w-full py-4 z-10 mb-4">
              <Link
                href={`/allproducts?category=${encodeURIComponent(
                  category.name
                )}`}
                className="inline-block w-full"
              >
                <Button
                  size="sm"
                  className="flex items-center justify-center gap-2 bg-black text-white hover:bg-black/80 ml-4"
                >
                  Go to Store
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
