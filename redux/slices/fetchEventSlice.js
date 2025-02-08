import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch data from Prisma using an API route
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await fetch("/api/getEvents"); // Replace with your API route
  if (!response.ok) throw new Error("Failed to fetch events");
  return await response.json();
});

/*const fetchEvents = async () => {
  try {
    const response = await fetch("/api/getEvents"); // Call the API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();
    //console.log(data);
    setEvents(data); // Update state with fetched data
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};*/

const fetchEventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    status: "idle",
    error: null,
  },
  reducers: {
    /*increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },*/
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

//export const { increment, decrement, incrementByAmount } = fetchEventSlice.actions;
export default fetchEventSlice.reducer;
