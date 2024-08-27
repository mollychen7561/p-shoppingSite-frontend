"use client";

import ProductCarousel from "@/components/homepage/ProductCarousel";
import Announcement from "@/components/homepage/Announcement";
import CategoryCard from "@/components/homepage/CategoryCard";
import { Alert } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const AlertPortal = () => {
    return mounted
      ? createPortal(
          <Alert
            className="rounded-none border-[#FFF4C1] bg-[#FFF4C1] font-medium text-gray-900 !p-0 relative h-[40px] sm:h-[48px]"
            open={true}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-yellow-800 text-xs sm:text-sm md:text-base text-center px-4">
                <span className="hidden sm:inline">Enter discount code </span>
                &apos;coupon888&apos;
                <span className="hidden sm:inline"> for 12% off!</span>
                <span className="inline sm:hidden"> for 12% off!</span> 🎉
              </p>
            </div>
          </Alert>,
          document.getElementById("alert-container")!
        )
      : null;
  };

  return (
    <>
      <AlertPortal />
      <div className="flex h-full w-full flex-col">
        <h3 className="my-6 sm:my-8 md:my-10 text-xl sm:text-2xl font-bold text-center">
          New Arrival
        </h3>
        <ProductCarousel />
        <Announcement />
        <h3 className="my-6 sm:my-8 md:my-10 text-xl sm:text-2xl font-bold text-center">
          All Categories
        </h3>
        <CategoryCard />
      </div>
    </>
  );
}
