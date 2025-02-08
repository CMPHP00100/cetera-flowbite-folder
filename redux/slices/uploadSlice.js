import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async ({ file, uploadUrl }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.put(uploadUrl, formData, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    uploading: false,
    uploadSuccess: null,
    uploadError: null,
  },
  reducers: {
    resetUploadState: (state) => {
      state.uploading = false;
      state.uploadSuccess = null;
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadSuccess = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload;
      });
  },
});

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;
