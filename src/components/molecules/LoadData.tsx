import { api } from "$config/site";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { useAppSelector } from "$hooks/useAppSelector";
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

    if (providers.length == 0) {
      getProviders();
    }
  }, [user, dispatch, providers]);

  return <div className="hidden"></div>;
};

export default LoadData;
