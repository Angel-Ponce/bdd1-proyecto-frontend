import { api } from "$config/site";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { useAppSelector } from "$hooks/useAppSelector";
import { setLoadingProducts, setProducts } from "$store/slices/productsSlice";
import {
  setLoadingProviders,
  setProviders,
} from "$store/slices/providersSlice";
import to from "await-to-ts";
import axios from "axios";
import { FC, useEffect } from "react";

const LoadData: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const providers = useAppSelector((state) => state.providers.providers);

  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    const getProviders = async () => {
      dispatch(setLoadingProviders(true));
      const [err, res] = await to(
        axios.get(`${api}/providers`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        console.error("Error al obtener los proveedores", err);
      }

      if (res.data.providers) {
        dispatch(setProviders(res.data.providers));
        dispatch(setLoadingProviders(false));
      }
    };

    const getProducts = async () => {
      dispatch(setLoadingProducts(true));
      const [err, res] = await to(
        axios.get(`${api}/items`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        console.error("Error al obtener los productos", err);
      }

      if (res.data.items) {
        dispatch(setProducts(res.data.items));
        dispatch(setLoadingProducts(false));
      }
    };

    if (providers.length == 0) {
      getProviders();
    }

    if (products.length == 0) {
      getProducts();
    }
  }, [user, dispatch, providers, products]);

  return <div className="hidden"></div>;
};

export default LoadData;
