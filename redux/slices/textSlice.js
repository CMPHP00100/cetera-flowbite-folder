import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedItems: [], // Store multiple items
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.selectedItems.push(action.payload); // Adding the new item
    },
    setSelectedItem: (state, action) => {
      state.selectedItems = [action.payload]; // Replace with the new selected item
    },
  },
});

export const { addItem, setSelectedItem } = textSlice.actions; // Export setSelectedItem here
export default textSlice.reducer;
