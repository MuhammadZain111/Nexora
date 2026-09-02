import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";

export const appStore = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
