import { NextPage } from "next";
import Header from "$templates/Header";
import { Breadcrumb, Typography, Button, Input, Select } from "antd";
import Link from "next/link";
import { useFormik } from "formik";
import { useState } from "react";
const { Title, Text } = Typography;
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

const Users: NextPage = () => {
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  const roles = [
    <Select.Option key={"admin"}>Administrador</Select.Option>,
    <Select.Option key={"cashier"}>Ventas</Select.Option>,
  ];
  const handleRoleChange = (value: string[]) => {
    addUserForm.setFieldTouched("roles", true);
    addUserForm.setFieldValue("roles", value);
  };

  const addUserForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: [],
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.name) {
        errors.name = "El campo Nombre es obligatorio.";
      }

      if (!values.email) {
        errors.email = "El campo Correo Electrónico es obligatorio.";
      }

      if (!values.password) {
        errors.password = "El campo Contraseña es obligatorio.";
      }

      if (values.password != values.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden.";
      }

      if (values.roles.length == 0) {
        errors.roles = "Debes seleccionar por lo menos 1 rol.";
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
      console.log(values);
      setCreatingUser(true);
    },
    validateOnChange: true,
  });

  return (
    <>
      <Header />
      <div className="w-full flex flex-col items-center">
        <div className="container">
          <div className="h-16 flex items-center w-full">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">
                  <a>Inicio</a>
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link href="/users">
                  <a>Usuarios</a>
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="flex justify-between mt-5">
            <div>
              <Title level={2}>Agregar usuario</Title>
              <Text>
                Completa los campos necesarios para agregar un usuario.
              </Text>

              <div className="mt-10">
                <div className="flex flex-col">
                  <Input
                    disabled={creatingUser}
                    status={
                      addUserForm.touched.name && addUserForm.errors.name
                        ? "error"
                        : undefined
                    }
                    type={"text"}
                    name="name"
                    size="large"
                    placeholder="Nombre"
                    prefix={<UserOutlined />}
                    onChange={addUserForm.handleChange}
                    value={addUserForm.values.name}
                  />
                  <Text className="!text-red-600 mt-1 h-[22px]">
                    {addUserForm.touched.name && addUserForm.errors.name
                      ? addUserForm.errors.name
                      : undefined}
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Input
                    disabled={creatingUser}
                    status={
                      addUserForm.touched.email && addUserForm.errors.email
                        ? "error"
                        : undefined
                    }
                    type={"email"}
                    name="email"
                    size="large"
                    placeholder="Ingresa tu correo electrónico"
                    prefix={<MailOutlined />}
                    onChange={addUserForm.handleChange}
                    value={addUserForm.values.email}
                  />
                  <Text className="!text-red-600 mt-1 h-[22px]">
                    {addUserForm.touched.email && addUserForm.errors.email
                      ? addUserForm.errors.email
                      : undefined}
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Input.Password
                    disabled={creatingUser}
                    status={
                      addUserForm.touched.password &&
                      addUserForm.errors.password
                        ? "error"
                        : undefined
                    }
                    type={"password"}
                    name="password"
                    size="large"
                    placeholder="Ingresa tu contraseña"
                    onChange={addUserForm.handleChange}
                    value={addUserForm.values.password}
                    prefix={<LockOutlined />}
                  />
                  <Text className="!text-red-600 mt-1 h-[22px]">
                    {addUserForm.touched.password && addUserForm.errors.password
                      ? addUserForm.errors.password
                      : undefined}
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Input.Password
                    disabled={creatingUser}
                    status={
                      addUserForm.touched.confirmPassword &&
                      addUserForm.errors.confirmPassword
                        ? "error"
                        : undefined
                    }
                    type={"password"}
                    name="confirmPassword"
                    size="large"
                    placeholder="Confirma tu contraseña"
                    onChange={addUserForm.handleChange}
                    value={addUserForm.values.confirmPassword}
                    prefix={<LockOutlined />}
                  />
                  <Text className="!text-red-600 mt-1 h-[22px]">
                    {addUserForm.touched.confirmPassword &&
                    addUserForm.errors.confirmPassword
                      ? addUserForm.errors.confirmPassword
                      : undefined}
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Select
                    status={
                      addUserForm.touched.roles && addUserForm.errors.roles
                        ? "error"
                        : undefined
                    }
                    size="large"
                    mode="multiple"
                    allowClear
                    placeholder="Selecciona un rol"
                    onChange={handleRoleChange}
                  >
                    {roles}
                  </Select>
                  <Text className="!text-red-600 mt-1 h-[22px]">
                    {addUserForm.touched.roles && addUserForm.errors.roles
                      ? addUserForm.errors.roles
                      : undefined}
                  </Text>
                </div>
                <Button
                  size="large"
                  type="primary"
                  loading={creatingUser}
                  onClick={() => addUserForm.handleSubmit()}
                >
                  Agregar usuario
                </Button>
              </div>
            </div>
            <div>Right</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
