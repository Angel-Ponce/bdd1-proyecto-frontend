import { List, Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import to from "await-to-ts";
import { useAppSelector } from "$hooks/useAppSelector";
import toast from "react-hot-toast";
import { api } from "$config/site";
import { removeUser, setUsers } from "$store/slices/usersSlice";
import { useAppDispatch } from "$hooks/useAppDispatch";

const UsersTable = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const [err, res] = await to(
        axios.get(`${api}/users`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        toast.error("Error al obtener los usuarios", {
          position: "bottom-right",
        });
      }

      dispatch(setUsers(res.data.users));
      setLoading(false);
    };

    if (users.users.length == 0) {
      getUsers();
    }
  }, [user, dispatch, users]);

  const handleUserDelete = async (id: string) => {
    setLoading(true);

    const [, res] = await to(
      axios.delete(`${api}/users/delete/${id}`, {
        headers: {
          "X-Token": user.token,
        },
      })
    );

    if (res) {
      toast.success("Usuario eliminado correctamente", {
        position: "bottom-right",
      });

      dispatch(removeUser({ id: id }));
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="min-h-[400px] max-h-[700px] w-full overflow-auto px-4 py-2 border-gray-300 border-[1px]">
        <List
          loading={loading}
          dataSource={users?.users || []}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.image} />}
                title={item.name}
                description={
                  <div>
                    {item.email} -{" "}
                    {item.roles.includes("admin") && "Administrador"}
                    {item.roles.length > 1 && " / "}
                    {item.roles.includes("cashier") && "Cajero"}
                  </div>
                }
              />
              <div>
                {user.email != item.email && (
                  <Button danger onClick={() => handleUserDelete(item.id)}>
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

export default UsersTable;
