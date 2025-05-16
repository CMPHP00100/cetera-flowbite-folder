//makeStore.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./slices/cartSlice";
import uploadReducer from "./slices/uploadSlice";
import textReducer from "./slices/textSlice";
import itemReducer from "./slices/itemSlice";

// Combine reducers from rootReducer
const rootReducer = combineReducers({
  cart: cartReducer,
  upload: uploadReducer,
  text: textReducer,
  item: itemReducer,
});

// Persist config for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["item", "text"], // Persist specific slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Function to create and configure the Redux store.
 * @returns {ReturnType<typeof configureStore>} A new Redux store instance.
 */

// Function to create a new Redux store
export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Prevent serialization warnings
      }),
  });
}
