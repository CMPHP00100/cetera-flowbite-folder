import { CartProvider } from "@/context/CartContext";

const Layout = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default Layout;
