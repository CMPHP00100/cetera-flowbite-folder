"use client";

import { useEffect, useState } from "react";
import { useShoppingCart } from "@/context/CartContext";
import { useParams } from "next/navigation";
//import { CartProvider } from "@/context/CartContext";
import ProductDetails from "@/components/shop-sections/product-details";
//import products from "@/data/products";

const SingleProduct = () => {
  const { products } = useShoppingCart(); // Get products from CartContext
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams(); // Extract `id` from the dynamic route using useParams

  // Log the extracted `id` to confirm it's being retrieved
  console.log("Product ID from URL:", id);

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find((product) => {
        // Ensure `product.id` is defined before calling `toString()`
        return product.spc && product.spc.toString() === id;
      });
      setSelectedProduct(product); // Set the selected product based on the id
    }
  }, [id, products]); // Re-run this effect when `id` or `products` changes

  if (!selectedProduct) {
    return <p>Loading product...</p>; // Show loading message while waiting for product data
  }

  return (
    <div>
      <ProductDetails product={selectedProduct} />
    </div>
  );
};

export default SingleProduct;
