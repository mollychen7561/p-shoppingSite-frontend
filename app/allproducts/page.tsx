import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// 使用 dynamic 導入來確保 ProductList 是客戶端組件
const ProductList = dynamic(() => import("@/components/products/ProductList"), {
  ssr: false // 這確保組件只在客戶端渲染
});

const AllProductsPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="py-8">
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
};

export default AllProductsPage;
