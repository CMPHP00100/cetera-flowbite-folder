// components/shop-sections/product.js
"use client";

import { useParams } from "next/navigation";
import { useShoppingCart } from "@/context/CartContext";
import { useEffect, useState, useCallback} from "react";
import Link from "next/link";
import ProductCard from "@/components/page-sections/product-card";
import ProductDetails from "@/components/shop-sections/product-details";
//import LoadingOverlay from "@/components/animations/loading-overlay";
import { BsCartPlus } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { motion } from "framer-motion";

export default function Product() {
  const { id } = useParams(); // This will be the product ID from URL like "NMYBI-GQNFH"
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const { addItem, cart } = useShoppingCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  // Check if we're viewing a specific product (id exists in URL)
  const isViewingSpecificProduct = Boolean(id);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search?query=flashlight`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.slice(0, limit));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Fetch specific product if ID is in URL
  const fetchSpecificProduct = useCallback(async (productId) => {
    if (!productId) return;
    
    try {
      setLoading(true);
      console.log("Fetching specific product:", productId);
      
      // Try productDetails API first
      let response = await fetch(`/api/productDetails?id=${productId}`);
      
      if (!response.ok) {
        console.log("ProductDetails failed, trying products API");
        // Fallback to products API
        response = await fetch(`/api/products?id=${productId}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const product = data.product || data;
      
      if (product) {
        setSelectedProduct(product);
      } else {
        console.error("No product found with ID:", productId);
      }
    } catch (error) {
      console.error("Error fetching specific product:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = Object.values(cart).find(
      (item) => item.spc === product.spc,
    );
    if (existingItem) {
      addItem({ ...existingItem, quantity: existingItem.quantity + 1 });
    } else {
      addItem({ ...product, quantity: 1 });
    }
  };

  const handleProductClick = (product) => {
    console.log("Clicked product:", product);
    setSelectedProduct(product);
  };

  useEffect(() => {
    if (isViewingSpecificProduct && id) {
      // If we have an ID in the URL, fetch that specific product
      fetchSpecificProduct(id);
    } else if (!isViewingSpecificProduct) {
      // Otherwise, fetch the product list
      fetchProducts();
    }
  }, [id, isViewingSpecificProduct, fetchProducts, fetchSpecificProduct]);

  // Filter products when searchQuery changes (only for product list view)
  useEffect(() => {
    if (!isViewingSpecificProduct) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, isViewingSpecificProduct]);

  // Function to increase limit
  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  // If we're viewing a specific product, show product details
  if (isViewingSpecificProduct) {
    if (loading) {
      return (
        <div className="container mx-auto px-4">
          <div className="py-8 text-center">
            <div className="text-lg">Loading product details...</div>
          </div>
        </div>
      );
    }

    if (!selectedProduct) {
      return (
        <div className="container mx-auto px-4">
          <div className="py-8 text-center">
            <div className="text-lg">Product not found</div>
          </div>
        </div>
      );
    }

    // Pass the fetched product data to ProductDetails - don't let it fetch again
    return (
      <div className="container mx-auto px-4">
        <ProductDetails 
          product={selectedProduct} 
          productId={id} 
          skipFetch={true} // Add this prop to prevent duplicate API calls
        />
      </div>
    );
  }

  // Otherwise, show the product list
  return (
    <div className="container-fluid">
      <div className="product-list-item row">
        {/* Animated Placeholder / Floating Label */}
        <motion.label
          initial={{ y: 20, opacity: 0.5 }}
          animate={{
            y: isFocused || value ? -20 : 20,
            opacity: isFocused || value ? 1 : 0.5,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute text-gray-400"
        >
          <p className="text-base/[1]">
            Let&lsquo;s search for your products...
          </p>
        </motion.label>
        <input
          type="text"
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !value && setIsFocused(false)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setValue(e.target.value);
          }}
          className="col-sm-12 mb-4 w-full border-x-0 border-b-2 border-t-0 border-b-cetera-orange bg-cetera-gray text-cetera-orange"
        />
        
        {loading ? (
          <div className="py-8 text-center">
            <motion.div
              className="w-8 h-8 bg-blue-600"
              animate={{
                borderRadius: ["0%", "50%", "0%"],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/*<div className="text-lg">Loading products...</div>*/}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                console.log(product);
                const price = product.prc;
                const name = product.name;
                const productId= product.prodEId;
                const spc = product.spc;
                const image = product.thumbPic;
                return (
                  <ProductCard
                    key={productId}
                    id={productId}
                    prodId={productId}
                    image={image}
                    title={name}
                    alt={name}
                    price={price}
                    spc={spc}
                    //button={<BsCartPlus />}
                    //buttonLink={() => handleAddToCart(product)}
                    button={<BsEyeFill className="text-lg" />}
                    buttonLink={`/product/${product.prodEId}`}
                    onClick={() => handleProductClick(product)}
                    className="mx-auto"
                  />
                );
              })
            ) : (
              <p>No products found</p>
            )}
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && !loading && (
          <button
            onClick={handleLoadMore}
            className="mt-4 bg-cetera-blue px-4 py-2 text-white hover:bg-cetera-orange"
          >
            Load More
          </button>
        )}
      </div>
      
      {/* Show product details if a product is selected from the list */}
      {!isViewingSpecificProduct && selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          skipFetch={true} // Prevent duplicate fetch since we already have the data
        />
      )}
    </div>
  );
}