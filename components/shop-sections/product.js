"use client";

import { useParams } from "next/navigation";
import { useShoppingCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import ProductCard from "@/components/page-sections/product-card";
import ProductDetails from "@/components/shop-sections/product-details";
import { BsCartPlus } from "react-icons/bs";
import { motion } from "framer-motion";

export default function Product() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const [limit, setLimit] = useState(20); // Initial limit
  const { addItem, cart } = useShoppingCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/search?query=flashlight`); // Ensure the API endpoint is correct
      const data = await response.json();
      // Manually limit the results on the client side
      setProducts(data.slice(0, limit));
    } catch (error) {
      //console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = (product) => {
    // Find existing item in cart using sku
    const existingItem = Object.values(cart).find(
      (item) => item.spc === product.spc,
    );
    if (existingItem) {
      // If the item already exists, update its quantity
      addItem({ ...existingItem, quantity: existingItem.quantity + 1 });
    } else {
      // Otherwise, add it to the cart
      addItem({ ...product, quantity: 1 });
    }
  };

  const handleProductClick = (product) => {
    console.log("Clicked product:", product);
    setSelectedProduct(product); // Set the selected product
  };

  useEffect(() => {
    fetchProducts();
  }, [id, limit]); // Runs when refresh changes

  // Filter products when searchQuery changes
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Function to increase limit
  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10); // Increase limit by 10
  };

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
            setSearchQuery(e.target.value), setValue(e.target.value);
          }}
          className="col-sm-12 mb-4 w-full border-x-0 border-b-2 border-t-0 border-b-cetera-orange bg-cetera-gray text-cetera-orange"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              // Extract values from product
              const price = product.prc;
              const name = product.name;
              const id = product.spc;
              const image = product.thumbPic;

              return (
                <ProductCard
                  key={id}
                  id={id}
                  image={image}
                  title={name}
                  price={price}
                  button={<BsCartPlus />}
                  buttonLink={() => handleAddToCart(product)}
                  onClick={() => handleProductClick(product)}
                  className="mx-auto"
                />
              );
            })
          ) : (
            <p>No products found</p>
          )}
        </motion.div>

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <button
            onClick={handleLoadMore}
            className="mt-4 bg-cetera-blue px-4 py-2 text-white hover:bg-cetera-orange"
          >
            Load More
          </button>
        )}
      </div>
      {selectedProduct && <ProductDetails product={selectedProduct} />}
    </div>
  );
}
