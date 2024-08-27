import React from "react";
import ProductList from "@/components/products/ProductList";

const AllProductsPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="py-8">
        <ProductList />
      </div>
    </div>
  );
};

export default AllProductsPage;
