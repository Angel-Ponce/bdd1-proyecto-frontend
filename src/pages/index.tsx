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
const { Title, Text } = Typography;
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

      <div className="w-full flex flex-col items-center">
        {mounted && (
          <div className="container">
            {isLoggedIn ? (
              <>
                <div className="h-16 flex items-center w-full">
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link href="/">
                        <a>Inicio</a>
                      </Link>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <Title level={2} className="!mt-5 ">
                  Hola, {user.name}.
                </Title>
                <Text>
                  Bienvenido a tu portal administrativo. ¿Qué deseas hacer hoy?
                </Text>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              <div className="flex justify-center items-center w-full min-h-[calc(100vh-4rem)]">
                <AccessDenied />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
