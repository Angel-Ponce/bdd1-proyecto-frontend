import { createSlice } from "@reduxjs/toolkit";

export interface Presentation {
  id: string;
  name: string;
  stock: number;
  quantity: number;
  sale_price: number;
  color: string;
  is_unit: boolean;
}

export interface Product {
  key: string;
  id: string;
  name: string;
  description: string;
  image_link: string;
  purchase_price: number;
  provider: string;
  provider_id: number;
  presentations: Presentation[];
}
interface ProductsState {
  products: Product[];
  loading: boolean;
}

interface SetAction {
  payload: Product[];
}

interface AddAction {
  payload: Product;
}

interface RemoveAction {
  payload: {
    id: string;
  };
}

interface LoadingAction {
  payload: boolean;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state: ProductsState, action: SetAction) => {
      return (state = { products: action.payload, loading: state.loading });
    },
    addProduct: (state: ProductsState, action: AddAction) => {
      return (state = {
        products: [action.payload, ...state.products],
        loading: state.loading,
      });
    },
    removeProduct: (state: ProductsState, action: RemoveAction) => {
      return (state = {
        products: state.products.filter(
          (products) => products.id != action.payload.id
        ),
        loading: state.loading,
      });
    },
    updateProduct: (state: ProductsState, action: AddAction) => {
      return (state = {
        products: state.products.map((product) => {
          if (product.id == action.payload.id) {
            return action.payload;
          }
          return product;
        }),
        loading: state.loading,
      });
    },
    setLoadingProducts: (state: ProductsState, action: LoadingAction) => {
      return (state = { products: state.products, loading: action.payload });
    },
  },
});

export const {
  setProducts,
  addProduct,
  removeProduct,
  updateProduct,
  setLoadingProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
