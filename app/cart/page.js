/* "use client";

import Cart from "@/components/cart";
import { products } from "@/utils/products";
import { CartProvider } from "use-shopping-cart";
import { useState } from "react";

export default function CartsPage() {
  return (
    <div>
      <CartProvider>
        <Cart />
      </CartProvider>
    </div>
  );
} */

/* "use client"; // ✅ Required at the top

import { useCart } from "@/context/CartContext"; // ✅ Ensure this is correct
import { useEffect, useState } from "react";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [localCart, setLocalCart] = useState(cart);
  //const [cartItems, setCartItems] = useState(cart);

  useEffect(() => {
    console.log("Cart state updated:", cart);
    setLocalCart(cart); // Ensure localCart is updated with the cart state
  }, [cart]); // Re-run whenever `cart` changes

  console.log("Cart contents:", cart);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {localCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        localCart.map((item) => (
          <div
            key={item.id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <p>
              {item.name} - ${item.price}
            </p>
            <p>Quantity: {item.quantity}</p>{" "}
            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            <button
              onClick={() => updateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart; */

"use client";

import Cart from "@/components/shop-sections/cart";
//import { CartProvider } from "@/context/CartContext";

export default function CartsPage() {
  return <Cart />;
}
