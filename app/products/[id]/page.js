// app/product/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useShoppingCart } from "@/context/CartContext";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/shop-sections/product-details";

const SingleProduct = () => {
  const { id } = useParams();
  const { fetchProductDetails } = useShoppingCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {

      if (!id) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log(`Loading product with ID: ${id}`);
        setLoading(true);
        setError(null);
        
        // Try to fetch product details
        const productData = await fetchProductDetails(id);
        
        if (productData) {
          console.log("Product loaded successfully:", productData);
          setProduct(productData);
        } else {
          console.log("No product data returned");
          setError("Product not found");
        }

      } catch (err) {
        console.error("Error loading product:", err);
        setError(`Failed to load product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProductDetails 
        product={product} 
      />
    </div>
  );
};

export default SingleProduct;