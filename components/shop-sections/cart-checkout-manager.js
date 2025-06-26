//components/shop-sections/cart-checkout-manager.js
"use client";

import { useState } from "react";
import Cart from "./cart";
import Checkout from "./checkout";

const CartCheckoutManager = () => {
  const [currentView, setCurrentView] = useState('cart'); // 'cart' or 'checkout'

  const handleProceedToCheckout = () => {
    setCurrentView('checkout');
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
  };

  return (
    <div>
      {currentView === 'cart' && (
        <Cart onProceedToCheckout={handleProceedToCheckout} />
      )}
      {currentView === 'checkout' && (
        <Checkout onBack={handleBackToCart} />
      )}
    </div>
  );
};

export default CartCheckoutManager;