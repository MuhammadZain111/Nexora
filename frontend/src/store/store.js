import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";


export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // socket instances / non-serializable payloads can trip this up if you ever
      // store the socket itself in state (don't) — keep this off unless needed
      serializableCheck: false,
    }),
});
