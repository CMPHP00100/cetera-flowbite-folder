// context/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [productDetails, setProductDetails] = useState([]); // Initialize as an empty array
  const [coupon, setCoupon] = useState(""); // Store coupon code
  const [discount, setDiscount] = useState(0); // Store discount value as percentage

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    calculateTotalPrice();
  }, [cart, discount]);

  // Helper function to get quantity tiers for a product
  const getQuantityTiers = (product) => {
    if (!product.originalProductDetails?.qty) return [];
    
    return product.originalProductDetails.qty
      .map((qty, index) => ({
        qty,
        price: product.originalProductDetails.prc?.[index] || product.prc,
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

  // Helper function to get the selected tier for a product
  const getSelectedTier = (product) => {
    const tiers = getQuantityTiers(product);
    return tiers.find(tier => tier.qty === product.selectedQuantity) || tiers[0];
  };

  // Updated addItem to handle cartId and price tiers
  const addItem = (product) => {
    console.log("Adding item to cart:", product);
    
    // Create cartId if not provided (for backward compatibility)
    const cartId = product.cartId || product.prodEId;
    
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[cartId]) {
        // If item exists, increment quantity
        updatedCart[cartId].quantity += 1;
      } else {
        // Add new item with cartId as key
        updatedCart[cartId] = { 
          ...product, 
          cartId,
          quantity: 1 
        };
      }
      console.log("Updated cart:", updatedCart);
      return updatedCart;
    });
  };

  // Updated removeItem to use cartId
  const removeItem = (cartId) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[cartId];
      console.log("Cart after removing item:", updatedCart);
      return updatedCart;
    });
  };

  // Updated increment to use cartId
  const increment = (cartId) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[cartId]) {
        updatedCart[cartId].quantity += 1;
      }
      return updatedCart;
    });
  };

  // Updated decrement to use cartId
  const decrement = (cartId) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[cartId] && updatedCart[cartId].quantity > 1) {
        updatedCart[cartId].quantity -= 1;
      }
      return updatedCart;
    });
  };

  // Updated updateQuantity to use cartId
  const updateQuantity = (cartId, amount) => {
    setCart((prev) => {
      if (!prev[cartId]) return prev;
      const updatedCart = { ...prev };
      updatedCart[cartId].quantity = Math.max(
        1,
        updatedCart[cartId].quantity + amount,
      );
      return updatedCart;
    });
  };

  // NEW: Function to update quantity tier (change price tier in cart)
  const updateQuantityTier = (oldCartId, newQuantityTier, newPrice) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      const item = updatedCart[oldCartId];
      
      if (!item) return prev;

      // Create new cartId with new quantity tier
      const newCartId = `${item.prodEId}_${item.selectedColor || 'default'}_${newQuantityTier}`;
      
      // Check if item with new tier already exists
      if (updatedCart[newCartId] && newCartId !== oldCartId) {
        // If exists, add quantities together
        updatedCart[newCartId].quantity += item.quantity;
        // Remove old item
        delete updatedCart[oldCartId];
      } else {
        // Update the item with new tier info
        const updatedItem = {
          ...item,
          cartId: newCartId,
          selectedQuantity: newQuantityTier,
          selectedQuantityNumber: parseInt(newQuantityTier.split(' ')[0]),
          prc: newPrice,
          displayName: `${item.prName} (${item.selectedColor || 'Default'}, ${newQuantityTier})`
        };
        
        // Remove old item and add updated item
        delete updatedCart[oldCartId];
        updatedCart[newCartId] = updatedItem;
      }
      
      console.log("Cart after tier update:", updatedCart);
      return updatedCart;
    });
  };

  // Apply coupon logic
  const applyCoupon = (couponCode) => {
    // For now, we'll use a mock coupon code and a fixed discount percentage
    if (couponCode === "DISCOUNT20") {
      setCoupon(couponCode);
      setDiscount(20); // 20% discount
    } else {
      alert("Invalid coupon code.");
      setCoupon("");
      setDiscount(0);
    }
  };

  // Updated calculateTotalPrice function with tier-based pricing
  const calculateTotalPrice = () => {
    let total = 0;
    Object.values(cart).forEach((product) => {
      let productPrice = 0;
      
      // Check if product has tier pricing
      const selectedTier = getSelectedTier(product);
      if (selectedTier) {
        // Use tier-based pricing: tier.qty * tier.price
        productPrice = selectedTier.qty * selectedTier.price;
      } else {
        // Fallback to original pricing logic
        if (typeof product.prc === 'string' && product.prc.trim() !== '') {
          // If prc is a non-empty string, try to parse it
          const priceStr = product.prc.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except decimal
          productPrice = parseFloat(priceStr);
        } else if (Array.isArray(product.prc) && product.prc.length > 0) {
          // If prc is an array, find the first valid price
          const validPrice = product.prc.find(price => price !== '' && price != null);
          if (validPrice) {
            const priceStr = String(validPrice).replace(/[^0-9.]/g, '');
            productPrice = parseFloat(priceStr);
          }
        } else if (typeof product.prc === 'number' && product.prc > 0) {
          // If prc is already a positive number
          productPrice = product.prc;
        }
      }
      
      // Only add to total if we have a valid price and quantity
      if (!isNaN(productPrice) && productPrice > 0 && product.quantity > 0) {
        total += productPrice * product.quantity;
      }
    });
    
    // Apply discount to total price
    if (discount > 0) {
      total = total - (total * discount) / 100;
    }
    
    setTotalPrice(total);
  };

  // Add function to get the coupon and discount
  const getCoupon = () => {
    return coupon;
  };

  // Function to fetch products with search query
  const fetchProducts = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      console.log('No search query provided, skipping products fetch');
      return [];
    }

    try {
      console.log('Fetching products with query:', searchQuery);
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully:', data);
      
      const fetchedProducts = data.products || [];
      console.log("fetched products:", fetchedProducts);
      setProducts(fetchedProducts);
      return fetchedProducts;
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setProducts([]);
      return [];
    }
  };

  // Function to fetch product details
  const fetchProductDetails = async (identifier) => {
    if (!identifier) {
      console.log('No identifier provided to fetchProductDetails');
      return null;
    }

    try {
      console.log(`Fetching product details for identifier: ${identifier}`);
      
      const response = await fetch(`/api/productDetails?id=${encodeURIComponent(identifier)}`);
      
      if (!response.ok) {
        console.error(`API response error: ${response.status} ${response.statusText}`);
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const productData = await response.json();
      
      if (!productData) {
        console.log('No product data returned from API');
        return null;
      }

      console.log('Product details fetched successfully:', productData);
      
      return {
        id: productData.prodEid || productData.id,
        prodEId: productData.prodEid,
        spc: productData.spc,
        name: productData.prName || productData.name,
        description: productData.description,
        price: productData.prc ? parseFloat(productData.prc[0]) : 0,
        image: productData.pics && productData.pics.length > 0 ? productData.pics[0].url : null,
        colors: productData.colors,
        category: productData.category,
        dimensions: productData.dimensions,
        colors: productData.colors,
        keywords: productData.keywords,
        themes: productData.themes,
        qty: productData.qty,
        prc: productData.prc,
        net: productData.net,
        options: productData.options,
        pics: productData.pics,
        supplier: productData.supplier,
        imprintArea: productData.imprintArea,
        imprintLoc: productData.imprintLoc,
        decorationMethod: productData.decorationMethod,
        setupChg: productData.setupChg,
        prodTime: productData.prodTime,
        priceIncludes: productData.priceIncludes,
        ...productData
      };

    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  };

  // Function to get a specific product from the products array
  const getProduct = (identifier, identifierType = 'prodEId') => {
    if (identifierType === 'prodEId') {
      return products.find(product => product.prodEId === identifier);
    } else {
      return products.find(product => product.spc === identifier);
    }
  };

  // Clear all items from cart
  const clearCart = () => {
    setCart({});
    setCoupon("");
    setDiscount(0);
    console.log("Cart cleared");
  };

  // Function to add product details to the array
  const addProductDetails = (details) => {
    console.log(details);
    if (!details || (!details.prodEId)) {
      console.log('Invalid product details provided - missing prodEId');
      return;
    }

    setProductDetails(prev => {
      const identifier = details.prodEId;
      const existingIndex = prev.findIndex(item => item.prodEId === identifier);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = details;
        console.log('Updated existing product details for:', identifier);
        return updated;
      } else {
        console.log('Added new product details for:', identifier);
        return [...prev, details];
      }
    });
  };

  // Function to get product details by identifier
  const getProductDetails = (identifier, identifierType = 'prodEId') => {
    if (identifierType === 'prodEId') {
      return productDetails.find(details => details.prodEId === identifier);
    } else {
      return productDetails.find(details => details.spc === identifier);
    }
  };

  // NEW: Get cart item count
  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  // NEW: Get unique product count (different from item count)
  const getUniqueProductCount = () => {
    return Object.keys(cart).length;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        increment,
        decrement,
        updateQuantity,
        updateQuantityTier, // NEW: For changing price tiers
        applyCoupon,
        coupon,
        getCoupon,
        totalPrice,
        products,
        productDetails,
        fetchProducts,
        fetchProductDetails,
        getProduct,
        clearCart,
        addProductDetails,
        getProductDetails,
        getCartItemCount, // NEW
        getUniqueProductCount, // NEW
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useShoppingCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within a CartProvider");
  }
  return context;
};