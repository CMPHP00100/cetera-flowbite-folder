/*import { configureStore } from "@reduxjs/toolkit";
//import thunk from "redux-thunk";
//import dataReducer from "./slices/dataSlice";
import itemReducer from "./slices/itemSlice";

const store = configureStore({
  reducer: {
    //data: dataReducer, // Add the data slice
    items: itemReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Default middleware
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  /*middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(thunk);
    console.log("Middleware:", middleware); // Ensure all middleware are functions
    return middleware;
  },
});

export default store;*/

import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
//import imageReducer from "./slices/imageSlice";
import uploadReducer from "./slices/uploadSlice";
import cartReducer from "./slices/cartSlice";

import textReducer from "./slices/textSlice"; // Import the reducer
import itemReducer from "./slices/itemSlice";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Initial state for the API data
const initialState = {
  data: [],
  loading: false,
  error: null,
};

// Create a slice
const apiSlice = createSlice({
  name: "apiData",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const { fetchStart, fetchSuccess, fetchFailure } = apiSlice.actions;

// Combine reducers (for scalability)
const rootReducer = combineReducers({
  apiData: apiSlice.reducer,
  //imageUpload: imageReducer,
  upload: uploadReducer,
  cart: cartReducer,
  text: textReducer,
  item: itemReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["item", "text"],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore Redux Persist serialization warnings
      },
    }),
});

export const persistor = persistStore(store);
persistor.purge();
//export default store;
export { store };
