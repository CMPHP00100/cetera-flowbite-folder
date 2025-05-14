import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import uploadReducer from "./slices/uploadSlice"; // Example of another reducer

const rootReducer = combineReducers({
  cart: cartReducer,
  upload: uploadReducer,
  // Add more reducers here
});

export default rootReducer;
