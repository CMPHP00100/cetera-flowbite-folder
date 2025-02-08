import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch data from Prisma
export const fetchPrismaData = createAsyncThunk(
  "data/fetchPrismaData",
  async () => {
    const response = await fetch("/api/data"); // Replace with your API route
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  },
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    items: [], // Prisma data
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrismaData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrismaData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPrismaData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
