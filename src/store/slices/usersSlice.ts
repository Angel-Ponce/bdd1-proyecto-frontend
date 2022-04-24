import { createSlice } from "@reduxjs/toolkit";
import { Role } from "./userSlice";

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  roles: Role[];
}

interface UserState {
  users: User[];
}

interface SetAction {
  payload: User[];
}

interface AddAction {
  payload: User;
}

interface RemoveUser {
  payload: {
    id: string;
  };
}

const initialState: UserState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state: UserState, action: SetAction) => {
      return (state = { users: action.payload });
    },
    addUser: (state: UserState, action: AddAction) => {
      return (state = { users: [...state.users, action.payload] });
    },
    removeUser: (state: UserState, action: RemoveUser) => {
      return (state = {
        users: state.users.filter((user) => user.id != action.payload.id),
      });
    },
  },
});

export const { setUsers, addUser, removeUser } = usersSlice.actions;

export default usersSlice.reducer;
