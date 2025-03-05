import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState: { data: [], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users";
      });
  },
});

export default usersSlice.reducer;
