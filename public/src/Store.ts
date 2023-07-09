import { configureStore } from "@reduxjs/toolkit";

import welcomeReducer from "../../src/app/login/login";

export const store = configureStore({
  reducer: {
    welcome: welcomeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
