import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";
import providersReducer from "./slices/providersSlice";
import productsReducer from "./slices/productsSlice";
import salesReducer from "./slices/salesSlice";
import reportReducer from "./slices/reportSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    providers: providersReducer,
    products: productsReducer,
    sales: salesReducer,
    report: reportReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
