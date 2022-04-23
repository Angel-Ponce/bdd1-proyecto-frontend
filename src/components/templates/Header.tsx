import { FC } from "react";
import { pageTitle } from "$config/site";
import { Typography } from "antd";
import Image from "next/image";
const { Title, Text } = Typography;

const Header: FC = () => {
  return (
    <div className="flex items-center border-[1px] border-gray-200 w-full h-16 px-10">
      <div className="mr-2 h-full grid place-items-center">
        <Image src={"/logo.svg"} alt={"logo"} width={40} height={30} priority />
      </div>
      <Title level={4} className="!m-0">
        {pageTitle}
      </Title>
      <Text className="!text-gray-400 ml-4">Bienvenido a {pageTitle}</Text>
    </div>
  );
};

export default Header;
