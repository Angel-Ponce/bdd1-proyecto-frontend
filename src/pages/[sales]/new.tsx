/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Header from "$templates/Header";
import { Badge, Breadcrumb, Button, Input, List, Typography } from "antd";
import Link from "next/link";
import { useLogin } from "$hooks/useLogin";
import AccessDenied from "$templates/AccessDenied";
import Head from "next/head";
import { pageTitle } from "$config/site";
import { useAppSelector } from "$hooks/useAppSelector";
import ProductCard from "$molecules/ProductCard";
import { useFormik } from "formik";
import { useState } from "react";
import {
  CreditCardOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const NewSale: NextPage = () => {
  const [isLoggedIn, mounted] = useLogin();

  const loadingProducts = useAppSelector((state) => state.products.loading);
  const products = useAppSelector((state) => state.products.products);

  const [selling, setSelling] = useState<boolean>(false);

  const { Text, Title } = Typography;

  const cartForm = useFormik({
    initialValues: {
      name: "",
      nit: "",
    },
    validate: (values) => {},
    onSubmit: (values) => {},
    validateOnMount: true,
  });

  return (
    <>
      <Head>
        <title>Ventas - {pageTitle}</title>

        <meta name="description" content="Generated by create next app" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />
      <div className="w-full flex flex-col items-center">
        {mounted && (
          <div className="container mb-8">
            {isLoggedIn ? (
              <>
                <div className="h-16 flex items-center w-full">
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link href="/">
                        <a>Inicio</a>
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link href="/sales">
                        <a>Ventas</a>
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link href="/sales/new">
                        <a>Nueva venta</a>
                      </Link>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>

                <div className="flex justify-between mt-5 gap-20 flex-col-reverse lg:flex-row">
                  <div className="w-full md:w-[30rem]">
                    <Title level={2}>Inventario</Title>
                    <Text>Busca y agrega productos al carrito de compras.</Text>

                    <div className="flex flex-wrap gap-4 max-h-[600px] overflow-y-auto py-5 px-2 mt-8">
                      {!loadingProducts && (
                        <>
                          {products.map((product, index) => {
                            return product.presentations.map(
                              (presentation, index2) => {
                                return (
                                  <div key={`${index}-${index2}`}>
                                    <ProductCard
                                      product={product}
                                      addToCart={() => {
                                        console.log("add to cart");
                                      }}
                                      removeFromCart={() => {
                                        console.log("HI");
                                      }}
                                      presentation={presentation}
                                    />
                                  </div>
                                );
                              }
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12">
                    <div className="flex items-center gap-2">
                      <Title level={2}>Carrito de compras</Title>

                      <Badge count={5}>
                        <ShoppingCartOutlined className="text-4xl mb-[0.938rem]" />
                      </Badge>
                    </div>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin sed rutrum nisl.{" "}
                    </Text>
                    <div className="mt-8">
                      <List
                        size="large"
                        header={
                          <div className="flex gap-2 w-full">
                            <div className="flex flex-col w-[60%]">
                              <Input
                                disabled={selling}
                                status={
                                  cartForm.touched.name && cartForm.errors.name
                                    ? "error"
                                    : undefined
                                }
                                type={"text"}
                                name="name"
                                size="large"
                                placeholder="Nombre"
                                prefix={<UserOutlined />}
                                onChange={cartForm.handleChange}
                                value={cartForm.values.name}
                              />
                              <Text className="!text-red-600 mt-1 h-[22px]">
                                {cartForm.touched.name && cartForm.errors.name
                                  ? cartForm.errors.name
                                  : undefined}
                              </Text>
                            </div>
                            <div className="flex flex-col w-[40%]">
                              <Input
                                disabled={selling}
                                status={
                                  cartForm.touched.nit && cartForm.errors.nit
                                    ? "error"
                                    : undefined
                                }
                                type={"number"}
                                name="nit"
                                size="large"
                                placeholder="NIT"
                                prefix={<IdcardOutlined />}
                                showCount
                                maxLength={9}
                                onChange={cartForm.handleChange}
                                value={cartForm.values.nit}
                              />
                              <Text className="!text-red-600 mt-1 h-[22px]">
                                {cartForm.touched.nit && cartForm.errors.nit
                                  ? cartForm.errors.nit
                                  : undefined}
                              </Text>
                            </div>
                          </div>
                        }
                        footer={
                          <div className="w-full flex justify-end">
                            <Button size="large" icon={<CreditCardOutlined />}>
                              Finalizar compra
                            </Button>
                          </div>
                        }
                        bordered
                        dataSource={["asdasd", "asdasd"]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                    </div>
                  </div>
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
    </>
  );
};

export default NewSale;
