import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  name: string;
}

interface ChangeNameAction {
  payload: string;
}

const initialState: UserState = { name: "John Doe" };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeName: (state: UserState, action: ChangeNameAction) => {
      state.name = action.payload;
    },
  },
});

export const { changeName } = userSlice.actions;

export default userSlice.reducer;
