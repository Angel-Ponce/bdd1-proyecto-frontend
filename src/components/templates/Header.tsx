import { FC } from "react";
import { pageTitle } from "$config/site";
import { Typography, Button } from "antd";
import Image from "next/image";
import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { logout } from "$store/slices/userSlice";
const { Title, Text } = Typography;

const Header: FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center justify-between border-[1px] border-gray-200 w-full h-16 px-7">
      <div className="flex items-center">
        <div className="mr-2 h-full grid place-items-center">
          <Image
            src={"/logo.svg"}
            alt={"logo"}
            width={40}
            height={30}
            priority
          />
        </div>
        <Title level={4} className="!m-0">
          {pageTitle}
        </Title>
        <Text className="!text-gray-400 ml-4 hidden sm:block">
          Bienvenido a {pageTitle}
        </Text>
      </div>
      {user.loggedIn && (
        <Button danger size="large" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      )}
    </div>
  );
};

export default Header;
