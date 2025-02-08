import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for making the POST request
export const addItem = createAsyncThunk(
  "items/addItem",
  async (itemData, thunkAPI) => {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error);
      }

      return await response.json(); // Return the created item
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

// Slice
const itemSlice = createSlice({
  name: "items",
  initialState: {
    items: [], // List of items
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload); // Add new item to the list
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error || "Failed to add item";
      });
  },
});

export default itemSlice.reducer;
