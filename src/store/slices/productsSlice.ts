import { createSlice } from "@reduxjs/toolkit";

export interface Presentation {
  id: string;
  name: string;
  stock: number;
  quantity: number;
  sale_price: number;
  color: string;
}

export interface Product {
  key: string;
  id: string;
  name: string;
  description: string;
  image_link: string;
  purchase_price: number;
  provider: string;
  presentations: Presentation[];
}
interface ProductsState {
  products: Product[];
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

const initialState: ProductsState = {
  products: <Product[]>[],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state: ProductsState, action: SetAction) => {
      return (state = { products: action.payload });
    },
    addProduct: (state: ProductsState, action: AddAction) => {
      return (state = { products: [...state.products, action.payload] });
    },
    removeProduct: (state: ProductsState, action: RemoveAction) => {
      return (state = {
        products: state.products.filter(
          (products) => products.id != action.payload.id
        ),
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
      });
    },
  },
});

export const { setProducts, addProduct, removeProduct, updateProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
