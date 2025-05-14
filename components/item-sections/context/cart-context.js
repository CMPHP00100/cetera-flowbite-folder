import { createContext, useContext, useState, useEffect } from "react";

//const CartContext = createContext(); // Create the context
const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when component mounts
  /*useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart)); // Load previous cart items
    }
  }, []);*/
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("cart"); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /*useEffect(() => {
    const debouncedSave = debounce(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, 500); // Adjust the delay as needed

    debouncedSave();
    return () => debouncedSave.cancel(); // Cleanup on unmount
  }, [cart]);*/

  const addToCart = (item) => {
    console.log("Adding to cart:", item);
    setCart((prevCart) => {
      const newCart = [...prevCart, item];
      localStorage.setItem("cart", JSON.stringify(newCart)); // Save immediately
      return newCart;
    });
    //setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (id) => {
    console.log("Removing item from cart:", id);
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    //setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  console.log("context:", context);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
