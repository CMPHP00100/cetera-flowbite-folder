"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [coupon, setCoupon] = useState(""); // Store coupon code
  const [discount, setDiscount] = useState(0); // Store discount value as percentage

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setTotalPrice();
  }, [cart]);

  const addItem = (product) => {
    console.log("Adding item to cart:", product); // Debugging log
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[product.spc]) {
        updatedCart[product.spc].quantity += 1;
      } else {
        updatedCart[product.spc] = { ...product, quantity: 1 };
      }
      console.log("Updated cart:", updatedCart); // Debugging log
      return updatedCart;
    });
  };

  const removeItem = (spc) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[spc];

      console.log("Cart after removing item:", updatedCart);
      return updatedCart;
    });
  };

  const increment = (spc) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[spc]) {
        updatedCart[spc].quantity += 1;
      }
      return updatedCart;
    });
  };

  const decrement = (spc) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[spc] && updatedCart[spc].quantity > 1) {
        updatedCart[spc].quantity -= 1;
      }
      return updatedCart;
    });
  };

  const updateQuantity = (spc, amount) => {
    setCart((prev) => {
      if (!prev[spc]) return prev;
      const updatedCart = { ...prev };
      updatedCart[spc].quantity = Math.max(
        1,
        updatedCart[spc].quantity + amount,
      );
      return updatedCart;
    });
  };

  // Apply coupon logic
  const applyCoupon = (couponCode) => {
    // For now, we'll use a mock coupon code and a fixed discount percentage (you can fetch this dynamically from an API)
    if (couponCode === "DISCOUNT20") {
      setCoupon(couponCode); // Set the coupon code
      setDiscount(20); // 10% discount
    } else {
      alert("Invalid coupon code.");
      setCoupon("");
      setDiscount(0);
    }
  };

  // Calculate total price after discount
  useEffect(() => {
    let total = 0;
    Object.values(cart).forEach((product) => {
      // Parse the price correctly
      const productPrice = parseFloat(product.prc.split(" - ")[0]);

      // Ensure valid price and quantity
      if (!isNaN(productPrice) && product.quantity > 0) {
        total += productPrice * product.quantity;
      }
    });
    // Apply discount to total price
    if (discount > 0) {
      total = total - (total * discount) / 100;
    }
    setTotalPrice(total);
  }, [cart, discount]);

  // Add function to get the coupon and discount
  const getCoupon = () => {
    return coupon; // Return the applied coupon code
  };

  /* const calculateTotalPrice = () => {
    let total = 0;
    Object.values(cart).forEach((product) => {
      total += parseFloat(product.prc.split(" - ")[0]) * product.quantity;
    });
    setTotalPrice(total);
  }; */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Ensure this API endpoint is correct
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data || []); // Ensure `data` is an array
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setProducts([]); // Set an empty array on failure
      }
    };

    fetchProducts();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        increment,
        decrement,
        updateQuantity,
        applyCoupon,
        coupon,
        getCoupon,
        totalPrice,
        products,
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
