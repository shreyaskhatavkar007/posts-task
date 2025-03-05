import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import postsReducer from "./slices/postsSlice";
import usersReducer from "./slices/usersSlice";
import commentsReducer from "./slices/commentsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
