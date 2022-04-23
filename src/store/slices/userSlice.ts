import { createSlice } from "@reduxjs/toolkit";
import ls from "store2";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}
interface UserState extends User {
  loggedIn: boolean;
}

interface LoginAction {
  payload: User;
}

const initialState: UserState = {
  id: "77dd9fc8-8978-42d1-b743-6c1c103b1ac4",
  name: "John Doe",
  email: "john@doe.com",
  token: "e81bf2f3-f71b-4bea-8da7-e45afdd81e8f",
  loggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state: UserState, action: LoginAction) => {
      ls.set("amabiscaUser", action.payload);
      return (state = { ...action.payload, loggedIn: true });
    },
    logout: (state: UserState) => {
      ls.remove("amabiscaUser");
      return (state = { ...initialState });
    },
  },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
