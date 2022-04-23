import { FC } from "react";
import { PageHeader } from "antd";
import { pageTitle } from "$config/site";

const Header: FC = () => {
  return (
    <PageHeader
      className="border-[1px] border-gray-200"
      title={pageTitle}
      subTitle={`Bienvenido a ${pageTitle}`}
    />
  );
};

export default Header;
