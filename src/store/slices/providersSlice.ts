import { createSlice } from "@reduxjs/toolkit";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ProvidersState {
  providers: Provider[];
}

interface SetAction {
  payload: Provider[];
}

interface AddAction {
  payload: Provider;
}

interface RemoveAction {
  payload: {
    id: string;
  };
}

const initialState: ProvidersState = {
  providers: [],
};

export const providersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setProviders: (state: ProvidersState, action: SetAction) => {
      return (state = { providers: action.payload });
    },
    addProvider: (state: ProvidersState, action: AddAction) => {
      return (state = { providers: [...state.providers, action.payload] });
    },
    removeProvider: (state: ProvidersState, action: RemoveAction) => {
      return (state = {
        providers: state.providers.filter(
          (provider) => provider.id != action.payload.id
        ),
      });
    },
  },
});

export const { setProviders, addProvider, removeProvider } =
  providersSlice.actions;

export default providersSlice.reducer;
