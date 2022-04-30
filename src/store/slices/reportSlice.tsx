import { createSlice } from "@reduxjs/toolkit";
import { User } from "./usersSlice";

export interface ItemsByProvider {
  name: string;
  items_count: number;
}

export interface ItemsSelled {
  name: string;
  details_count: number;
}

export interface SalesByMonth {
  total: number;
  month: number;
}

export interface Report {
  sales_count: number;
  sales_earnings: number;
  best_seller: User;
  items_by_provider: ItemsByProvider[];
  items_selled: ItemsSelled[];
  sales_by_month: SalesByMonth[];
}

interface SetAction {
  payload: Report;
}

const initialState: Report = {
  best_seller: {
    email: "",
    id: "",
    image: "",
    name: "",
    roles: [],
  },
  items_by_provider: [],
  items_selled: [],
  sales_by_month: [],
  sales_count: 0,
  sales_earnings: 0,
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReport: (state: Report, action: SetAction) => {
      return action.payload;
    },
  },
});

export const { setReport } = reportSlice.actions;

export default reportSlice.reducer;
