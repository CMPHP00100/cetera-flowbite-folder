// pages/_app.js
"use client";
/*import { Provider } from "react-redux";
//import store from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
//import { CartProvider } from "../context/cart-context";
import "bootstrap/dist/css/bootstrap.min.css";*/

/*export default function RootLayout({ children }) {
  return <Provider store={store}>{children}</Provider>;
}*/

//import { CartProvider } from "use-shopping-cart";
//import type { AppProps } from 'next/app';

/*function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;*/

/* 
<Provider store={store}>
      <Component {...pageProps} />
    </Provider>

*/
import { CartProvider } from "@/context/CartContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function MyApp({ Component, pageProps }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </DndProvider>
  );
}

{
  /* <CartProvider
      mode="payment"
      cartMode="client-only"
      currency="USD"
      shouldPersist
      //stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    > */
}
