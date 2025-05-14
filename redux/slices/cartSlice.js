import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      console.log("Cart updated:", state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.prodEId !== action.payload,
      );
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
