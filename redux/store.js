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

import { configureStore, createSlice } from "@reduxjs/toolkit";
//import imageReducer from "./slices/imageSlice";
import uploadReducer from "./slices/uploadSlice";

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

// Export reducer
const store = configureStore({
  reducer: {
    apiData: apiSlice.reducer,
    //imageUpload: imageReducer,
    upload: uploadReducer,
  },
});

export default store;
