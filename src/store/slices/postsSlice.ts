import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: { data: [], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load posts";
      });
  },
});

export default postsSlice.reducer;
