import { createSlice } from "@reduxjs/toolkit";
import { Role } from "./userSlice";

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  roles: Role[];
}

interface UsersState {
  users: User[];
}

interface SetAction {
  payload: User[];
}

interface AddAction {
  payload: User;
}

interface RemoveAction {
  payload: {
    id: string;
  };
}

const initialState: UsersState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state: UsersState, action: SetAction) => {
      return (state = { users: action.payload });
    },
    addUser: (state: UsersState, action: AddAction) => {
      return (state = { users: [...state.users, action.payload] });
    },
    removeUser: (state: UsersState, action: RemoveAction) => {
      return (state = {
        users: state.users.filter((user) => user.id != action.payload.id),
      });
    },
  },
});

export const { setUsers, addUser, removeUser } = usersSlice.actions;

export default usersSlice.reducer;
