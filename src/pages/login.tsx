import { api, pageTitle } from "$config/site";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "$templates/Header";
import { Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useFormik } from "formik";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { login } from "$store/slices/userSlice";
const { Title, Text } = Typography;
import { useRouter } from "next/router";
import { useLogin } from "$hooks/useLogin";
import axios from "axios";
import { useEffect, useState } from "react";
import to from "await-to-ts";
import toast from "react-hot-toast";

const Login: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoggedIn, mounted] = useLogin();
  const [logginIn, setLogginIn] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.email) {
        errors.email = "El campo Correo Electrónico es obligatorio.";
      }

      if (!values.password) {
        errors.password = "El campo Contraseña es obligatorio.";
      }

      if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Dirección de correo electrónico no válida";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLogginIn(true);

      const [err, res] = await to(
        axios.post(`${api}/login`, {
          email: values.email,
          password: values.password,
        })
      );

      if (err) {
        toast.error("Error al iniciar sesión", {
          position: "bottom-right",
        });
        setLogginIn(false);
        return;
      }

      const { data } = res;

      if (data.error) {
        if (data.description == "User credentials not valid") {
          toast.error("Credenciales invalidas.", {
            position: "bottom-right",
          });
          setLogginIn(false);
          return;
        }
      }

      dispatch(
        login({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
          roles: data.roles,
        })
      );

      router.push("/");
      setLogginIn(false);
    },
    validateOnChange: true,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Iniciar sesión - {pageTitle}</title>

        <meta name="description" content="Generated by create next app" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-col flex-1 justify-center items-center">
        {mounted && !isLoggedIn && (
          <div className="flex flex-col w-full sm:w-96 gap-3 container">
            <div className="flex flex-col w-full items-center mb-10">
              <Title level={3} className="!text-blue-500 text-center">
                Iniciar sesión
              </Title>
              <Text className="text-center">Inicia sesión para continuar</Text>
            </div>

            <div className="flex flex-col">
              <Input
                disabled={logginIn}
                status={
                  formik.touched.email && formik.errors.email
                    ? "error"
                    : undefined
                }
                type={"email"}
                name="email"
                size="large"
                placeholder="Ingresa tu correo electrónico"
                prefix={<MailOutlined />}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <Text className="!text-red-600 mt-1 h-[22px]">
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : undefined}
              </Text>
            </div>
            <div className="flex flex-col">
              <Input.Password
                disabled={logginIn}
                status={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : undefined
                }
                type={"password"}
                name="password"
                size="large"
                placeholder="Ingresa tu contraseña"
                onChange={formik.handleChange}
                value={formik.values.password}
                prefix={<LockOutlined />}
              />
              <Text className="!text-red-600 mt-1 h-[22px]">
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined}
              </Text>
            </div>
            <Button
              size="large"
              type="primary"
              loading={logginIn}
              onClick={() => formik.handleSubmit()}
            >
              Iniciar sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
