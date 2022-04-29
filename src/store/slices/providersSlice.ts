import { createSlice } from "@reduxjs/toolkit";

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items_count?: number;
}

interface ProvidersState {
  providers: Provider[];
  loading: boolean;
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

interface LoadingAction {
  payload: boolean;
}

const initialState: ProvidersState = {
  providers: [],
  loading: true,
};

export const providersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setProviders: (state: ProvidersState, action: SetAction) => {
      return (state = { providers: action.payload, loading: state.loading });
    },
    addProvider: (state: ProvidersState, action: AddAction) => {
      return (state = {
        providers: [...state.providers, action.payload],
        loading: state.loading,
      });
    },
    removeProvider: (state: ProvidersState, action: RemoveAction) => {
      return (state = {
        providers: state.providers.filter(
          (provider) => provider.id != action.payload.id
        ),
        loading: state.loading,
      });
    },
    updateProvider: (state: ProvidersState, action: AddAction) => {
      return (state = {
        providers: state.providers.map((provider) => {
          if (provider.id == action.payload.id) {
            return action.payload;
          }
          return provider;
        }),
        loading: state.loading,
      });
    },
    setLoadingProviders: (state: ProvidersState, action: LoadingAction) => {
      return (state = { providers: state.providers, loading: action.payload });
    },
  },
});

export const {
  setProviders,
  addProvider,
  removeProvider,
  updateProvider,
  setLoadingProviders,
} = providersSlice.actions;

export default providersSlice.reducer;
