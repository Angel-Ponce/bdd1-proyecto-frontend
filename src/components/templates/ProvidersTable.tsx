import { List, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import to from "await-to-ts";
import { useAppSelector } from "$hooks/useAppSelector";
import toast from "react-hot-toast";
import { api } from "$config/site";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { removeProvider, setProviders } from "$store/slices/providersSlice";

const ProvidersTable = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const providers = useAppSelector((state) => state.providers);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProviders = async () => {
      setLoading(true);
      const [err, res] = await to(
        axios.get(`${api}/providers`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        toast.error("Error al obtener los proveedores", {
          position: "bottom-right",
        });
      }

      dispatch(setProviders(res.data.providers));
      setLoading(false);
    };

    if (providers.providers.length == 0) {
      getProviders();
    }
  }, [user, dispatch, providers]);

  const handleProviderDelete = async (id: string) => {
    setLoading(true);

    const [, res] = await to(
      axios.delete(`${api}/providers/delete/${id}`, {
        headers: {
          "X-Token": user.token,
        },
      })
    );

    if (res) {
      toast.success("Proveedor eliminado correctamente", {
        position: "bottom-right",
      });

      dispatch(removeProvider({ id: id }));
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="min-h-[400px] max-h-[700px] w-full overflow-auto px-4 py-2 border-gray-300 border-[1px]">
        <List
          loading={loading}
          dataSource={providers?.providers || []}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={item.name}
                description={<div>{item.email}</div>}
              />
              <div>
                {user.email != item.email && (
                  <Button danger onClick={() => handleProviderDelete(item.id)}>
                    Borrar
                  </Button>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ProvidersTable;
