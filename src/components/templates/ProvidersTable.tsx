import { List, Button, Modal } from "antd";
import { useState } from "react";
import axios from "axios";
import to from "await-to-ts";
import { useAppSelector } from "$hooks/useAppSelector";
import toast from "react-hot-toast";
import { api } from "$config/site";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { Provider, removeProvider } from "$store/slices/providersSlice";
import EditProvider from "./EditProvider";
import { separateNumberWithDashes } from "$helpers/separateNumberWithDashes";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ProvidersTable = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const providers = useAppSelector((state) => state.providers);
  const loadingProviders = useAppSelector((state) => state.providers.loading);

  const [loading, setLoading] = useState<boolean>(false);

  const [showEditProviderModal, setShowEditProviderModal] =
    useState<boolean>(false);

  const handleProviderDelete = async (id: string) => {
    Modal.confirm({
      title: "¿Enserio deseas borrar este proveedor?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Recuerda que al borrarlo se eliminaran también todos sus productos asociados.",
      async onOk() {
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

        return res;
      },
      onCancel() {},
    });
  };

  const [provider, setProvider] = useState<Provider | null>(null);

  const openEditProviderModal = (p: Provider) => {
    setProvider(p);
    setShowEditProviderModal(true);
  };

  return (
    <div>
      <div className="min-h-[400px] max-h-[700px] w-full overflow-auto px-4 py-2 border-gray-300 border-[1px]">
        <List
          loading={loading || loadingProviders}
          dataSource={providers?.providers || []}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={item.name}
                description={
                  <div className="flex flex-col">
                    <p className="!m-0">{item.email}</p>
                    <p className="!m-0">{item.address}</p>
                    <p className="!m-0">
                      {separateNumberWithDashes(Number(item.phone))}
                    </p>
                    <p className="!m-0">
                      Productos asociados: {item.items_count}
                    </p>
                  </div>
                }
              />
              <div>
                {user.email != item.email && (
                  <div className="flex gap-3">
                    <Button onClick={() => openEditProviderModal(item)}>
                      Editar
                    </Button>
                    <Button
                      danger
                      onClick={() => handleProviderDelete(item.id)}
                    >
                      Borrar
                    </Button>
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
      <Modal
        title="Editar Proveedor"
        visible={showEditProviderModal}
        footer={null}
        afterClose={() => setProvider(null)}
        closable={false}
      >
        <EditProvider
          provider={provider}
          setShowModal={setShowEditProviderModal}
        />
      </Modal>
    </div>
  );
};

export default ProvidersTable;
