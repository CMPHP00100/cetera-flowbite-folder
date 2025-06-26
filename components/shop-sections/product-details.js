// components/shop-sections/product-details.js
"use client";
import { useEffect, useState } from "react";
import { useShoppingCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  // Add the new translucent colors with metallic silver
  'translucent blue/metallic silver': '#628ae0', // Light blue with 50% opacity
  'translucent green/metallic silver': '#6df294', // Light green with 50% opacity
  'translucent yellow/metallic silver': '#f9f920', // Yellow with 50% opacity
  'translucent purple/metallic silver': '#8653f4', // Medium purple with 50% opacity
  'translucent red/metallic silver': '#fc5537', // Light red with 50% opacity
  'translucent orange/metallic silver': '#f7a311', // Orange with 50% opacity
  'translucent pink/metallic silver': '#f96b83', // Pink with 50% opacity
  // Add fallbacks for variations in naming
  'translucent blue': '#628ae0',
  'translucent green': '#6df294',
  'translucent yellow': '#f9f920',
  'translucent purple': '#8653f4',
  'translucent red': '#fc5537',
  'translucent orange': '#f7a311',
  'translucent pink': '#f96b83'
};

function getColorHex(colorName) {
  const cleanName = colorName.trim().toLowerCase();
  return colorMap[cleanName] || '#cccccc';
}

export default function ProductDetails({ product, productId }) {
  const { addItem, getProductDetails } = useShoppingCart();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Get the correct product ID (prefer prodEId if available)
  const productIdentifier = product?.prodEId || productId;

  if (!product) {
    return <p className="text-red-500">Product not found or still loading...</p>;
  }

  // Update image URL parameters
  const updateRSParam = (url, newRSValue) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      if (params.get("RS") !== newRSValue) {
        params.set("RS", newRSValue);
        urlObj.search = params.toString();
      }
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  // Get the price for the selected quantity
  const getSelectedPrice = () => {
    if (!productDetails || !selectedQuantity) return product.prc;
    
    const validPairs = productDetails.qty
      .map((qty, index) => ({
        qty,
        price: productDetails.prc?.[index] || product.prc,
        index
      }))
      .filter(pair => 
        pair.qty && 
        pair.qty !== '' && 
        pair.qty !== '0' && 
        pair.price && 
        pair.price !== ''
      );

    const selectedPair = validPairs.find(pair => pair.qty === selectedQuantity);
    return selectedPair ? selectedPair.price : product.prc;
  };

  // Create a unique cart item ID that includes product, color, and quantity tier
  const createCartItemId = () => {
    const baseId = productIdentifier || product.spc;
    const colorSuffix = selectedColor ? `-${selectedColor.toLowerCase().replace(/\s+/g, '')}` : '';
    const quantitySuffix = selectedQuantity ? `-qty${selectedQuantity}` : '';
    return `${baseId}${colorSuffix}${quantitySuffix}`;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        // First check if we have details in cache
        const cachedDetails = getProductDetails(productIdentifier);
        if (cachedDetails) {
          setProductDetails(cachedDetails);
          return;
        }

        const response = await fetch(`/api/productDetails?id=${productIdentifier}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        const details = data.product || data; // Handle both formats
        setProductDetails(details);

        // Initialize selections
        if (details.colors) {
          const colors = details.colors.split(/\s*,\s*/).filter(Boolean);
          if (colors.length) setSelectedColor(colors[0]);
        }
        if (details.qty?.length) {
          // Find first valid quantity
          const validPairs = details.qty
            .map((qty, index) => ({
              qty,
              price: details.prc?.[index] || product.prc,
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
      } catch (error) {
        console.error("Fetch error:", error);
        setProductDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (productIdentifier) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [productIdentifier, getProductDetails]);

  // Get safe array of images
  const productImages = productDetails?.pics || [];
  const colorOptions = productDetails?.colors?.split(/\s*,\s*/).filter(Boolean) || [];

  // Get current image URL with fallbacks
  const getCurrentImageUrl = () => {
    if (productImages.length === 0) return updateRSParam(product.thumbPic, "1800");
    return updateRSParam(productImages[currentImageIndex]?.url, "1800");
  };

  if (loading) return <div className="p-8 text-center">
    Loading details...
    </div>;
  if (!productDetails) return <div className="p-8 text-center">No product details available</div>;

  return (
    <div className="bg-light-gray">
      <div className="py-8">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-7xl items-center space-x-2 px-4 sm:px-6 lg:px-8">
            <li>
              <div className="flex items-center">
                <a href="/" className="mr-2 text-sm font-medium text-gray-900">Home</a>
                <svg className="h-5 w-4 text-gray-300" viewBox="0 0 16 20" fill="currentColor">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <a href="/product" className="mr-2 text-sm font-medium text-gray-900">Products</a>
                <svg className="h-5 w-4 text-gray-300" viewBox="0 0 16 20" fill="currentColor">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <a href="#" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name} | {product.spc}
              </a>
            </li>
          </ol>
        </nav>

        {/* Split view layout */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            
            {/* Left side - Images */}
            <div className="flex flex-col">
              {/* Main product image */}
              <div className="aspect-h-4 aspect-w-3 overflow-hidden bg-none">

                <button onClick={() => router.back()} className="mt-4 mb-2 text-cetera-orange hover:text-cetera-orange/80">
                ← Back
              </button>

                <Image
                  src={getCurrentImageUrl()}
                  alt={product.name}
                  className="h-full w-full object-cover object-center rounded-xl"
                  width={600}
                  height={800}
                  priority
                />
              </div>

              {/* Image thumbnails */}
              {productImages.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {productImages.map((pic, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-h-1 aspect-w-1 overflow-hidden bg-white rounded-lg border-2 ${
                        currentImageIndex === index ? 'border-cetera-orange' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={updateRSParam(pic.url, "1800")}
                        alt={`Thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Product Information */}
            <div className="mt-6 px-4 sm:mt-14 sm:px-0 md:mt-6">
              
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>
              
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  {selectedQuantity ? (
                    `$${getSelectedPrice()}`
                  ) : (
                    (() => {
                      const validPrices = productDetails.prc.filter(prc => prc !== '' && prc != null);
                      if (validPrices.length === 0) return null;
                      
                      const highestPrice = Math.max(...validPrices.map(prc => parseFloat(prc)));
                      const lowestPrice = Math.min(...validPrices.map(prc => parseFloat(prc)));
                      
                      return `$${lowestPrice.toFixed(2)} - $${highestPrice.toFixed(2)}`;
                    })()
                  )}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-base text-gray-700">
                  <p>{productDetails.description || product.description}</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {/* Enhanced Color Selector with Swatches */}
                {colorOptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Color</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {colorOptions.map((color) => {
                        const cleanColor = color.trim();
                        // Find if this color has a specific image
                        const hasColorImage = productDetails.pics?.some(
                          pic => pic.color?.toLowerCase() === cleanColor.toLowerCase()
                        );
                        
                        return (
                          <button
                            key={cleanColor}
                            onClick={() => setSelectedColor(cleanColor)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              selectedColor === cleanColor 
                                ? 'border-cetera-orange scale-110' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ 
                              backgroundColor: getColorHex(cleanColor),
                              minWidth: '32px',
                              minHeight: '32px'
                            }}
                            title={cleanColor}
                          >
                            {/* Show checkmark if image exists for this color */}
                            {hasColorImage && (
                              <span className="sr-only">(Has image)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedColor && (
                      <p className="mt-2 text-sm text-gray-600">Selected: {selectedColor}</p>
                    )}
                  </div>
                )}
               
                {/* Quantity selection */}
                {productDetails.qty?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Quantity & Price</h3>
                    <select
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(e.target.value)}
                      className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-cetera-orange focus:outline-none focus:ring-cetera-orange sm:text-sm"
                    >
                      {(() => {
                        const validPairs = productDetails.qty
                          .map((qty, index) => ({
                            qty,
                            price: productDetails.prc?.[index] || product.prc,
                            index
                          }))
                          .filter(pair => 
                            pair.qty && 
                            pair.qty !== '' && 
                            pair.qty !== '0' && 
                            pair.price && 
                            pair.price !== ''
                          );

                        return validPairs.map((pair) => (
                          <option key={pair.index} value={pair.qty}>
                            {pair.qty} pcs - ${parseFloat(pair.price).toFixed(2)}
                          </option>
                        ));
                      })()}
                    </select>
                  </div>
                )}

                {/* Add to cart button */}
                <button
                  onClick={() => {
                    const cartItem = {
                      ...product,
                      cartId: createCartItemId(), // Unique cart ID
                      selectedColor,
                      selectedQuantity,
                      selectedQuantityNumber: parseInt(selectedQuantity) || 1,
                      prc: getSelectedPrice(), // Selected price for this quantity tier
                      pics: productDetails.pics || [{ url: product.thumbPic }],
                      // Keep original product details for reference
                      originalProductDetails: productDetails,
                      // Display name with variants
                      displayName: `${product.name}${selectedColor ? ` - ${selectedColor}` : ''}${selectedQuantity ? ` (${selectedQuantity} pcs)` : ''}`
                    };
                    
                    addItem(cartItem);
                  }}
                  disabled={!selectedQuantity}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-cetera-gray px-8 py-3 text-base font-medium text-white hover:bg-cetera-orange focus:outline-none focus:ring-2 focus:ring-cetera-orange focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                {/* Product details */}
                <div className="border-t border-gray-200 py-12">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
                  <div className="space-y-3">
                    {productDetails.dimensions && (
                      <div className="flex">
                        <span className="text-sm font-medium text-gray-900 w-24">Dimensions:</span>
                        <span className="text-sm text-gray-600">{productDetails.dimensions}</span>
                      </div>
                    )}
                    {colorOptions.length > 0 && (
                      <div className="flex">
                        <span className="text-sm font-medium text-gray-900 w-24">Colors:</span>
                        <span className="text-sm text-gray-600">{productDetails.colors}</span>
                      </div>
                    )}
                    {productDetails.decorationMethod && (
                      <div className="flex">
                        <span className="text-sm font-medium text-gray-900 w-24">Decoration:</span>
                        <span className="text-sm text-gray-600">{productDetails.decorationMethod}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}