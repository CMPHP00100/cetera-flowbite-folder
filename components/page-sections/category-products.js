import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useShoppingCart } from "@/context/CartContext";

const CategoryProducts = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [likedItems, setLikedItems] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");

  // Add cart context
  const { addItem, getProductDetails, fetchProductDetails } = useShoppingCart();

  const hoverColors = ["#273B5B"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/d1Products?page=1&limit=100`);
      const data = await response.json();

      const allProducts = data.products || [];
      const formattedProducts = allProducts.map((p, i) => ({
        ...p,
        hoverColor: hoverColors[i % hoverColors.length]
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return typeof price === 'number' ? `$${price.toFixed(2)}` : `$${price}`;
  };

  const toggleLike = (id) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const openModal = async (product) => {
    setSelectedProduct(product);
    setSelectedColor("");
    setSelectedQuantity("");
    setProductDetails(null);
    document.body.style.overflow = 'hidden';

    // Fetch detailed product information like ProductDetails does
    try {
      const productIdentifier = product.prodEId || product.spc || product.id;
      
      // Check cache first
      const cachedDetails = getProductDetails(productIdentifier);
      if (cachedDetails) {
        setProductDetails(cachedDetails);
        initializeSelections(cachedDetails);
        return;
      }

      // Fetch from API
      const details = await fetchProductDetails(productIdentifier);
      if (details) {
        setProductDetails(details);
        initializeSelections(details);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      // Use basic product info as fallback
      setProductDetails(product);
      initializeBasicSelections(product);
    }
  };

  const initializeSelections = (details) => {
    // Initialize color selection
    if (details.colors) {
      const colors = details.colors.split(/\s*,\s*/).filter(Boolean);
      if (colors.length) setSelectedColor(colors[0]);
    }

    // Initialize quantity selection (same logic as ProductDetails)
    if (details.qty?.length) {
      const validPairs = details.qty
        .map((qty, index) => ({
          qty,
          price: details.prc?.[index] || details.prc || 0,
          index
        }))
        .filter(pair => 
          pair.qty && 
          pair.qty !== '' && 
          pair.qty !== '0' && 
          pair.price && 
          pair.price !== ''
        );
      
      if (validPairs.length > 0) {
        setSelectedQuantity(validPairs[0].qty);
      }
    }
  };

  const initializeBasicSelections = (product) => {
    // Fallback initialization for basic product data
    if (product.colors) {
      const colors = product.colors.split(/\s*,\s*/).filter(Boolean);
      if (colors.length) setSelectedColor(colors[0]);
    }
    setSelectedQuantity("1"); // Default quantity
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setProductDetails(null);
    setSelectedColor("");
    setSelectedQuantity("");
    document.body.style.overflow = 'unset';
  };

  // Create a unique cart item ID (same logic as ProductDetails)
  const createCartItemId = (product, color, quantity) => {
    const baseId = product.prodEId || product.spc || product.id;
    const colorSuffix = color ? `-${color.toLowerCase().replace(/\s+/g, '')}` : '';
    const quantitySuffix = quantity ? `-qty${quantity}` : '';
    return `${baseId}${colorSuffix}${quantitySuffix}`;
  };

  // Get the price for the selected quantity (same logic as ProductDetails)
  const getSelectedPrice = () => {
    if (!productDetails || !selectedQuantity) {
      return selectedProduct?.prc || 0;
    }
    
    const validPairs = productDetails.qty
      ?.map((qty, index) => ({
        qty,
        price: productDetails.prc?.[index] || selectedProduct?.prc || 0,
        index
      }))
      .filter(pair => 
        pair.qty && 
        pair.qty !== '' && 
        pair.qty !== '0' && 
        pair.price && 
        pair.price !== ''
      ) || [];

    const selectedPair = validPairs.find(pair => pair.qty === selectedQuantity);
    return selectedPair ? selectedPair.price : (selectedProduct?.prc || 0);
  };

  const handleAddToBag = () => {
    if (selectedProduct && selectedQuantity) {
      // Create cart item exactly like ProductDetails does
      const cartItem = {
        ...selectedProduct,
        cartId: createCartItemId(selectedProduct, selectedColor, selectedQuantity),
        selectedColor,
        selectedQuantity,
        selectedQuantityNumber: parseInt(selectedQuantity) || 1,
        prc: getSelectedPrice(),
        // Ensure proper image format for cart
        pics: productDetails?.pics || [{ url: selectedProduct.pics }],
        thumbPic: selectedProduct.pics, // Direct image URL for cart display
        image: selectedProduct.pics, // Additional image property for cart compatibility
        originalProductDetails: productDetails,
        // Map product name consistently
        name: selectedProduct.prName,
        prName: selectedProduct.prName,
        displayName: `${selectedProduct.prName}${selectedColor ? ` - ${selectedColor}` : ''}${selectedQuantity ? ` (${selectedQuantity} pcs)` : ''}`
      };
      
      addItem(cartItem);
      console.log(`Added to cart:`, cartItem);
      closeModal();
    }
  };

  // Get available colors as array
  const getColorOptions = (details) => {
    if (!details?.colors) return [];
    return details.colors.split(/\s*,\s*/).filter(Boolean);
  };

  // Get valid quantity/price pairs (same logic as ProductDetails)
  const getValidQuantityPairs = (details) => {
    if (!details?.qty?.length) return [];
    
    return details.qty
      .map((qty, index) => ({
        qty,
        price: details.prc?.[index] || selectedProduct?.prc || 0,
        index
      }))
      .filter(pair => 
        pair.qty && 
        pair.qty !== '' && 
        pair.qty !== '0' && 
        pair.price && 
        pair.price !== ''
      );
  };

  // Color mapping function (same as ProductDetails)
  const colorMap = {
    red: '#ff0000',
    blue: '#0000ff',
    green: '#008000',
    black: '#000000',
    white: '#ffffff',
    silver: '#c0c0c0',
    gold: '#ffd700',
    purple: '#800080',
    royal: '#4169e1',
    navy: '#0C2441',
    orange: '#fd5d01',
    yellow: '#ecd31f',
    'lime green': '#6acf27',
    'silver/blue': '#3069bd',
    'silver/green': '#448967',
    'silver/red': '#d54659',
    'silver/purple': '#3a1652',
    'silver/yellow': '#e9c866',
    'silver/black': '#373c38',
    'blue/metallic silver': '#091b92',
    'green/metallic silver': '#008000',
    'orange/metallic silver': '#fd5d01',
    'purple/metallic silver': '#8653f4',
    'red/metallic silver': '#cc403b',
    'pink/metallic silver': '#f96b83',
    'silver/metallic silver': '#afb298',
    'white/metallic silver': '#ffffff',
    'yellow/metallic silver': '#f9f920',
    'burgundy red/metallic silver': '#540100',
    'gold/metallic silver': '#ffd700',
    'black/metallic silver': '#373C38',
    'royal blue': '#255393',
    'navy blue': '#0C2441',
    'translucent blue/metallic silver': '#628ae0',
    'translucent green/metallic silver': '#6df294',
    'translucent yellow/metallic silver': '#f9f920',
    'translucent purple/metallic silver': '#8653f4',
    'translucent red/metallic silver': '#fc5537',
    'translucent orange/metallic silver': '#f7a311',
    'translucent pink/metallic silver': '#f96b83',
    'translucent blue': '#628ae0',
    'translucent green': '#6df294',
    'translucent yellow': '#f9f920',
    'translucent purple': '#8653f4',
    'translucent red': '#fc5537',
    'translucent orange': '#f7a311',
    'translucent pink': '#f96b83'
  };

  const getColorHex = (colorName) => {
    const cleanName = colorName.trim().toLowerCase();
    return colorMap[cleanName] || '#cccccc';
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: (index) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
  };

  // Product Modal Component
  const ProductModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;

    const colorOptions = getColorOptions(productDetails || product);
    const quantityPairs = getValidQuantityPairs(productDetails);

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-cetera-light-gray rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full bg-none hover:text-cetera-mono-orange transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-6">
                  {/* Product Image */}
                  <div className="relative mt-4 sm:mt-0">
                    <div className="aspect-square bg-tan rounded-xl overflow-hidden">
                      <img
                        src={product.pics}
                        alt={product.prName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(product.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition ${
                        likedItems.has(product.id) 
                          ? 'bg-transparent text-cetera-mono-orange' 
                          : 'bg-transparent text-cetera-mono-orange hover:bg-white'
                      }`}
                    >
                      <Heart size={20} className={likedItems.has(product.id) ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6 mt-0 sm:mt-8">
                    <div>
                      <h1 className="text-3xl font-bold text-cetera-dark-blue mb-2 font-cetera-libre">
                        {product.prName}
                      </h1>
                      <span className="text-2xl font-semibold text-cetera-dark-blue font-cetera-josefin">
                        {selectedQuantity ? (
                          `$${getSelectedPrice()}`
                        ) : (
                          (() => {
                            if (!productDetails?.prc) return formatPrice(product.prc);
                            const validPrices = productDetails.prc.filter(prc => prc !== '' && prc != null);
                            if (validPrices.length === 0) return formatPrice(product.prc);
                            
                            const highestPrice = Math.max(...validPrices.map(prc => parseFloat(prc)));
                            const lowestPrice = Math.min(...validPrices.map(prc => parseFloat(prc)));
                            
                            return `$${lowestPrice.toFixed(2)} - $${highestPrice.toFixed(2)}`;
                          })()
                        )}
                      </span>
                      {/* Stock Status */}
                      <span className={`ms-2 text-sm ${product.inStock !== false ? 'text-green-600' : 'text-red-600'} font-cetera-josefin`}>
                        {product.inStock !== false 
                          ? `In Stock${product.stockCount ? ` (${product.stockCount} available)` : ''}` 
                          : 'Out of Stock'
                        }
                      </span>
                    </div>

                    {/* Description */}
                    {(productDetails?.description || product.description) && (
                      <div className="flex mt-4">
                        <h3 className="font-semibold text-cetera-dark-blue font-cetera-libre">Description: </h3>
                        <p className="ps-2 text-cetera-dark-blue font-cetera-josefin">
                          {productDetails?.description || product.description}
                        </p>
                      </div>
                    )}

                    {/* Category */}
                    <div className="flex mt-1">
                      <span className="font-semibold text-cetera-dark-blue font-cetera-libre">Category: </span>
                      <span className="ps-2 text-cetera-dark-blue font-cetera-josefin">
                        {product.category?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                      </span>
                    </div>

                    {/* Color Selection */}
                    {colorOptions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-cetera-dark-blue font-cetera-libre mb-3">Color</h3>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => {
                            const cleanColor = color.trim();
                            return (
                              <button
                                key={cleanColor}
                                onClick={() => setSelectedColor(cleanColor)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  selectedColor === cleanColor 
                                    ? 'border-cetera-mono-orange scale-110' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                style={{ 
                                  backgroundColor: getColorHex(cleanColor),
                                  minWidth: '32px',
                                  minHeight: '32px'
                                }}
                                title={cleanColor}
                              />
                            );
                          })}
                        </div>
                        {selectedColor && (
                          <p className="mt-2 text-sm text-cetera-dark-blue font-cetera-josefin">
                            Selected: {selectedColor}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quantity & Price Selection (same as ProductDetails) */}
                    {quantityPairs.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-cetera-dark-blue font-cetera-libre">Quantity & Price</h3>
                        <select
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(e.target.value)}
                          className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-cetera-mono-orange focus:outline-none focus:ring-cetera-mono-orange sm:text-sm"
                        >
                          {quantityPairs.map((pair) => (
                            <option key={pair.index} value={pair.qty}>
                              {pair.qty} pcs - ${parseFloat(pair.price).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Add to Cart */}
                    {product.inStock !== false && (
                      <motion.button
                        onClick={handleAddToBag}
                        disabled={!selectedQuantity}
                        className="w-full bg-cetera-dark-blue text-cetera-mono-orange mt-4 py-2 px-3 rounded-lg hover:bg-cetera-mono-orange hover:text-cetera-dark-blue transition-colors flex items-center justify-center space-x-2 font-cetera-josefin disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart size={20} />
                        <span>
                          Add to Cart{selectedQuantity && getSelectedPrice() ? ` - $${parseFloat(getSelectedPrice()).toFixed(2)}` : ''}
                        </span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Individual product card component
  const AnimatedProductCard = ({ product, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
      once: false,
      margin: "-30px 0px -30px 0px"
    });

    return (
      <motion.div
        ref={ref}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="group no-underline leading-[1.3em] product-tile col-span-1 cursor-pointer"
        onClick={() => openModal(product)}
      >
        <div className="aspect-[326/407] overflow-hidden rounded-[0.625rem] mb-3 relative">
          {product.category === 'featured' && (
            <motion.div 
              className="bg-cetera-mono-yellow uppercase text-[10px] xs:text-8 tracking-[0.06em] px-[0.4375rem] py-[0.3125rem] leading-none bg-yellow rounded-xl absolute top-2 left-2 md:top-3 md:left-3 lg:top-5 lg:left-5 z-10"
              initial={{ opacity: 0, scale: 0, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -10 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            >
              Best Seller
            </motion.div>
          )}
          
          <motion.div 
            className="transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.1] group-hover:translate-y-[-5%] relative w-full res-image block overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ paddingTop: '124.84662576687117%' }}></div>
            <img
              src={product.pics}
              alt={product.prName}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 50%', opacity: 1 }}
            />
          </motion.div>

          <motion.button
            className="absolute z-[2] left-2 right-2 md:left-5 md:right-5 bottom-2 md:bottom-5 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,color,background] duration-300 ease-out justify-center text-14 no-underline flex items-center rounded-3xl whitespace-nowrap min-h-[2.375rem] px-4 text-white hover:text-black bg-black hover:bg-yellow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              openModal(product);
            }}
          >
            <span>Quick View</span>
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition absolute top-2 right-2 z-20 ${
              likedItems.has(product.id) 
                ? 'bg-transparent text-cetera-mono-orange' 
                : 'bg-transparent text-cetera-mono-orange hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={likedItems.has(product.id) ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart size={20} className={likedItems.has(product.id) ? 'fill-current' : ''} />
          </motion.button>
        </div>
        
        <motion.div 
          className="text-[1rem] font-cetera-josefin text-cetera-dark-blue hover:text-cetera-mono-orange"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span>{product.prName}</span>
        </motion.div>
        <motion.div 
          className="text-sm md:text-md text-grey-60 font-cetera-josefin text-cetera-dark-blue row-fluid"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <span className="col-md-10 text-gray-500">{product.colors}</span>
          <span className="col-md-2 float-end me-2 text-gray-500">{formatPrice(product.prc)}</span>
        </motion.div>
      </motion.div>
    );
  };

  if (loading || error || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <motion.h1 
          className="text-[2rem] md:text-[3rem] font-bold text-orange-600 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Category Collection
        </motion.h1>
        <motion.p 
          className="text-gray-900 text-[0.75rem] md:text-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          See more curated products filtered by category
        </motion.p>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {products.length === 0 && !loading && <p>No products found.</p>}
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 sm:mt-8 w-auto grid-layout col-span-full p-4">
        <motion.div 
          className="text-center mb-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[2rem] md:text-[3rem] font-bold text-cetera-dark-orange mb-2 font-cetera-libre">
            Category Collection
          </h1>
          <p className="text-gray-900 text-[0.75rem] md:text-lg font-cetera-libre mb-6">
            See more curated products filtered by category
          </p>
        </motion.div>

        <motion.div 
          className="col-span-full flex items-center justify-center mb-2 gap-2 sm:gap-3 lg:gap-[0.625rem] px-2 sm:px-4 lg:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="col-span-full flex flex-wrap sm:flex-nowrap items-center justify-center mb-12 gap-2 sm:gap-3"> 
            {['All', 'Electronic Products', 'Chairs', 'Lamps'].map((category, index) => {
              const categoryKey = category.toLowerCase().replace(' ', '_');
              return (
                <motion.button
                  key={categoryKey}
                  className={`btn-link text-sm sm:text-base no-underline font-cetera-josefin flex items-center rounded-3xl whitespace-nowrap transition-colors duration-150 ease-in-out min-h-[2.375rem] px-4 ${
                    category === 'All'
                      ? 'text-cetera-dark-orange hover:text-cetera-dark-blue bg-cetera-dark-blue hover:bg-cetera-dark-orange'
                      : 'border border-border hover:bg-cetera-dark-blue hover:text-cetera-dark-orange text-cetera-dark-blue bg-cetera-dark-orange'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => {
                    if (category === 'All') {
                      setFilteredProducts(products);
                    } else {
                      const filtered = products.filter(p =>
                        p.category?.toLowerCase().replace(/\s/g, '_') === categoryKey
                      );
                      setFilteredProducts(filtered);
                    }
                  }}
                >
                  {category === 'Electronic Products' ? 'Electronics' : category}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product, index) => (
            <AnimatedProductCard 
              key={product.id} 
              product={product} 
              index={index} 
            />
          ))}
        </motion.div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={closeModal}
      />
    </>
  );
};

export default CategoryProducts;