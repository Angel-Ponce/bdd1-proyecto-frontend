import type { NextPage } from "next";
import Head from "next/head";
import Header from "$templates/Header";
import { pageTitle } from "$config/site";
import AccessDenied from "$templates/AccessDenied";
import { useLogin } from "$hooks/useLogin";
import { Card, Typography, Breadcrumb } from "antd";
import { ReactNode } from "react";
import {
  ShoppingCartOutlined,
  UserOutlined,
  PieChartOutlined,
  TagOutlined,
  SmileOutlined,
  FunnelPlotOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useAppSelector } from "$hooks/useAppSelector";
const { Title } = Typography;
interface Page {
  name: string;
  route: string;
  icon: ReactNode;
}

const Home: NextPage = () => {
  const [isLoggedIn, mounted] = useLogin();

  const user = useAppSelector((state) => state.user);

  const pages: Page[] = [
    {
      name: "Ventas",
      route: "/sales",
      icon: <ShoppingCartOutlined />,
    },
    {
      name: "Usuarios",
      route: "/users",
      icon: <UserOutlined />,
    },
    {
      name: "Reportes",
      route: "/reports",
      icon: <PieChartOutlined />,
    },
    { name: "Productos", route: "/products", icon: <TagOutlined /> },
    { name: "Clientes", route: "/clients", icon: <SmileOutlined /> },
    { name: "Proveedores", route: "/providers", icon: <FunnelPlotOutlined /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />

      <div className="flex flex-col flex-1 justify-center items-center">
        {mounted && (
          <div className="container">
            {isLoggedIn ? (
              <>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href="/">
                      <a>Inicio</a>
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <Title level={2} className="!mb-10 sm:!mb-20 !text-blue-500">
                  Hola, {user.name}.
                </Title>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {pages.map((page, index) => (
                    <Link passHref href={page.route} key={index}>
                      <a>
                        <Card hoverable>
                          <div className="flex items-center gap-4">
                            <div className="text-2xl flex justify-center items-center">
                              {page.icon}
                            </div>
                            <Title level={5} className="!m-0">
                              {page.name}
                            </Title>
                          </div>
                        </Card>
                      </a>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <AccessDenied />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
