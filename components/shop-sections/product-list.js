"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShoppingCart } from "@/context/CartContext";

const ProductList = () => {
  const { addItem } = useShoppingCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //const response = await fetch("/api/products");
        const response = await fetch(`/api/products?query=${query}`);
        const products = await response.json();
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data); // Set products fetched from API
        setLoading(false); // Set loading to false once data is loaded
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Stop loading even on error
      }
      return products;
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
    console.log("Product added from ProductList:", product); // Check if product is passed correctly
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li
            key={product.prodEId}
            className="flex items-center gap-4 border-b p-2"
          >
            <div>
              <Link href={`/product/${product.prodEId}`}>
                <h3>{product.name}</h3>
              </Link>
              <p>{product.colors}</p>
              <p>${product.prc}</p>
              <button
                onClick={() => handleAddToCart(product)} // Add to cart
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
