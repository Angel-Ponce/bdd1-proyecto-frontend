import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";
import providersReducer from "./slices/providersSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    providers: providersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
