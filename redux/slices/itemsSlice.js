import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
  },
  /*reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },*/
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload); // Adding item to the array
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

//export const { setSelectedItem } = itemSlice.actions;
export const { addItem, removeItem } = itemSlice.actions;
export default itemSlice.reducer;
