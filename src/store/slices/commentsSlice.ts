import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ page, postID }: { page: number; postID: number }) => {
    const response = await axios.get(
      postID ? `${COMMENTS_URL}?postId=${postID}` : COMMENTS_URL,
      {
        params: postID ? {} : { _limit: 10, _page: page },
      },
    );
    return response.data;
  },
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ name, body }: { name: string; body: string }) => {
    const response = await axios.post(COMMENTS_URL, { body, name });
    return response.data;
  },
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, body }: { id: number; body: string }) => {
    const response = await axios.put(`${COMMENTS_URL}/${id}`, { body });
    return response.data;
  },
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id: number) => {
    await axios.delete(`${COMMENTS_URL}/${id}`);
    return id;
  },
);

interface Comment {
  id: number;
  name: string;
  body: string;
  email: string;
}

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  page: number;
  hasMore: boolean;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  page: 1,
  hasMore: true,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length < 10) {
          state.hasMore = false;
        }
        state.comments.push(...action.payload);
        state.page += 1;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) state.comments[index].body = action.payload.body;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
