import { createSlice } from "@reduxjs/toolkit";

export interface SoldProductDetail {
  id: string;
  /**
   * quantity of product sold
   */
  quantity: number;
  sale_price: number;
  item: {
    id: string;
    name: string;
    image_link: string;
  };
  presentation: {
    id: string;
    name: string;
    color: string;
    quantity: number;
  };
  subtotal: number;
}

export interface Sale {
  key: string;
  id: string;
  sale_date: string;
  /**
   * total sale price
   */
  total: number;
  invoice: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  customer: {
    id: number;
    name: string;
    nit: string;
  };
  items_bought: SoldProductDetail[];
}

interface SalesState {
  sales: Sale[];
}

interface SetAction {
  payload: Sale[];
}

interface AddAction {
  payload: Sale;
}

interface RemoveAction {
  payload: {
    id: string;
  };
}

const initialState: SalesState = {
  sales: [],
};

export const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSales: (state: SalesState, action: SetAction) => {
      return (state = { sales: action.payload });
    },
    addSales: (state: SalesState, action: AddAction) => {
      return (state = {
        sales: [action.payload, ...state.sales],
      });
    },
    removeProduct: (state: SalesState, action: RemoveAction) => {
      return (state = {
        sales: state.sales.filter((sales) => sales.id != action.payload.id),
      });
    },
    updateProduct: (state: SalesState, action: AddAction) => {
      return (state = {
        sales: state.sales.map((product) => {
          if (product.id == action.payload.id) {
            return action.payload;
          }
          return product;
        }),
      });
    },
  },
});

export const { addSales, removeProduct, setSales, updateProduct } =
  salesSlice.actions;

export default salesSlice.reducer;
