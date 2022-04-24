import { List, Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import to from "await-to-ts";
import { useAppSelector } from "$hooks/useAppSelector";
import { Role } from "$store/slices/userSlice";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  roles: Role[];
}

const UsersTable = () => {
  const user = useAppSelector((state) => state.user);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const [err, res] = await to(
        axios.get("https://bdd1-proyecto-backend.vercel.app/users", {
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

      setUsers(res.data.users);
      setLoading(false);
    };

    getUsers();
  }, [user.token]);

  return (
    <div>
      <div className="min-h-[400px] w-full overflow-auto px-4 py-2 border-gray-300 border-[1px]">
        <List
          loading={loading}
          dataSource={users}
          renderItem={(user) => (
            <List.Item key={user.id}>
              <List.Item.Meta
                avatar={<Avatar src={user.image} />}
                title={user.name}
                description={
                  <div>
                    {user.email} -{" "}
                    {user.roles.includes("admin") && "Administrador"}
                    {user.roles.length > 1 && " / "}
                    {user.roles.includes("cashier") && "Cajero"}
                  </div>
                }
              />
              <div>
                <Button danger>Borrar</Button>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default UsersTable;
