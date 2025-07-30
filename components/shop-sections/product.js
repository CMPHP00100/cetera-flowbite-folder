// components/shop-sections/product.js
"use client";

import { useParams } from "next/navigation";
import { useShoppingCart } from "@/context/CartContext";
import { useEffect, useState, useCallback} from "react";
import Link from "next/link";
import ProductCard from "@/components/page-sections/product-card";
import ProductDetails from "@/components/shop-sections/product-details";
//import LoadingOverlay from "@/components/animations/loading-overlay";
//import { BsCartPlus } from "react-icons/bs";
//import { BsEyeFill } from "react-icons/bs";
import { HiArrowSmallRight } from "react-icons/hi2";
import { motion } from "framer-motion";

export default function Product() {
  const { id } = useParams(); // This will be the product ID from URL like "NMYBI-GQNFH"
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { addItem, cart } = useShoppingCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Check if we're viewing a specific product (id exists in URL)
  const isViewingSpecificProduct = Boolean(id);

  // Fetch categories function with better error handling
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      console.log('Fetching categories...');
      
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories response:', data);
      
      if (Array.isArray(data)) {
        setCategories(data);
        // Set default category if none selected and categories exist
        if (data.length > 0 && !selectedCategory) {
          const defaultCategory = data[0]?.name || data[0]?.Name || 'Flashlights';
          setSelectedCategory(defaultCategory);
          console.log('Set default category:', defaultCategory);
        }
      } else {
        console.error('Categories response is not an array:', data);
        setCategories([]);
        // Set a fallback category if API doesn't return categories
        const fallbackCategories = [
          { id: 1, name: 'Flashlights' },
          { id: 2, name: 'Bags' },
          { id: 3, name: 'Drinkware' },
          { id: 4, name: 'Electronics' },
          { id: 5, name: 'Apparel' }
        ];
        console.log('Using fallback categories:', fallbackCategories);
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      // Set a fallback category
      if (!selectedCategory) {
        setSelectedCategory('Flashlights');
      }
    } finally {
      setCategoriesLoading(false);
    }
  }, [selectedCategory]);

  // Fetch products function with improved category support
  const fetchProducts = useCallback(async () => {
    if (!selectedCategory) {
      console.log('No category selected, skipping product fetch');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching products for category:', selectedCategory);
      
      // Use the search API with category parameter
      const params = new URLSearchParams({
        category: selectedCategory,
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products API response:', data);
      
      if (Array.isArray(data)) {
        const limitedProducts = data.slice(0, limit);
        setProducts(limitedProducts);
        console.log('Set products:', limitedProducts.length);
      } else {
        console.error('Products response is not an array:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, limit]);

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

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    console.log('Category changed to:', newCategory);
    setSelectedCategory(newCategory);
    setSearchQuery(""); // Clear search when changing category
    setValue("");
    setProducts([]); // Clear current products
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when category changes or component mounts
  useEffect(() => {
    if (isViewingSpecificProduct && id) {
      // If we have an ID in the URL, fetch that specific product
      fetchSpecificProduct(id);
    } else if (!isViewingSpecificProduct && selectedCategory) {
      // Otherwise, fetch the product list for the selected category
      fetchProducts();
    }
  }, [id, selectedCategory, isViewingSpecificProduct, fetchProducts, fetchSpecificProduct]);

  // Filter products when searchQuery changes (only for product list view)
  useEffect(() => {
    if (!isViewingSpecificProduct) {
      if (searchQuery.trim() === "") {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter((product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
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
            <Link href="/product" className="text-blue-600 hover:underline mt-2 inline-block">
              ← Back to products
            </Link>
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
        {/* Search Input with Animated Label */}
        <div className="col-sm-12 col-md-6 mb-4 relative">
          <motion.label
            initial={{ y: 20, opacity: 0.5 }}
            animate={{
              y: isFocused || value ? -20 : 20,
              opacity: isFocused || value ? 1 : 0.5,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute text-gray-400 pointer-events-none"
          >
            <p className="text-base/[1] leading-[4] ps-2 text-black">
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
            //className="w-full mt-4 border-x-0 border-b-2 border-t-0 border-b-cetera-orange bg-white text-cetera-orange p-2 rouded-lg"
            className="w-full mt-4 border-1 font-cetera-josefin border-gray-300 rounded focus:ring-2 focus:ring-cetera-orange focus:border-cetera-orange"
            //placeholder={isFocused ? "" : ""}
          />
        </div>

        {/* Category Selector */}
        <div className="col-sm-12 col-md-6 mb-4">
          {/*<label htmlFor="category-select" className="block text-sm font-medium mb-2">
            Select Category:
          </label>*/}
          {categoriesLoading ? (
            <div className="p-2 text-gray-500">Loading categories...</div>
          ) : (
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full mt-2 mt-md-4 p-2 font-cetera-josefin border border-gray-300 rounded focus:ring-2 focus:ring-cetera-orange focus:border-cetera-orange"
              disabled={categoriesLoading}
            >
              {categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((category) => {
                  const categoryId = category.id || category.Id;
                  const categoryName = category.name || category.Name || category;
                  return (
                    <option key={categoryId} value={categoryName}>
                      {categoryName}
                    </option>
                  );
                })
              )}
            </select>
          )}
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="col-sm-12 py-8 text-center">
            <motion.div
              className="w-8 h-8 bg-blue-600 mx-auto"
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
            <div className="text-lg mt-2">Loading products...</div>
          </div>
        ) : (
          /* Products Grid */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="col-sm-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                console.log('Rendering product:', product);
                const price = product.prc;
                const name = product.name;
                const productId = product.prodEId || product.id;
                const spc = product.spc;
                const image = product.thumbPic;
                
                return (
                  <ProductCard
                    key={productId || spc}
                    id={productId}
                    prodId={productId}
                    image={image}
                    title={name}
                    alt={name}
                    price={price}
                    spc={spc}
                    //button={<BsEyeFill className="text-lg" />}
                    button={<span>{'More Info '}<HiArrowSmallRight className="text-xl inline lh-0 mt-[-2px]" /></span>}
                    buttonLink={`/products/${productId}`}
                    onClick={() => handleProductClick(product)}
                    className="mx-auto"
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-black-500">
                  {selectedCategory ? 
                    `No products found in "${selectedCategory}" category` : 
                    'Please select a category to view products'
                  }
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && !loading && (
          <button
            onClick={handleLoadMore}
            className="mt-4 bg-cetera-mono-orange px-4 py-2 text-white hover:text-cetera-dark-blue font-cetera-josefin"
          >
            Load More
          </button>
        )}
      </div>
      
      {/* Show product details if a product is selected from the list */}
      {!isViewingSpecificProduct && selectedProduct && (
        <div className="mt-8">
          <ProductDetails 
            product={selectedProduct} 
            skipFetch={true} // Prevent duplicate fetch since we already have the data
          />
        </div>
      )}
    </div>
  );
}