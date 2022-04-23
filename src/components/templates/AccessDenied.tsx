import { FC } from "react";
import { Result, Button } from "antd";
import { useRouter } from "next/router";
import { logout } from "$store/slices/userSlice";
import { useAppDispatch } from "$hooks/useAppDispatch";

const AccessDenied: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const goToLogin = () => {
    dispatch(logout());
    router.push("/login");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <Result
      status="error"
      title="Acceso denegado"
      subTitle="¡Oops! Parece que no tienes acceso a este módulo. Consulta con tu administrador si crees que esto es una equivocación."
      extra={[
        <Button key="login" type="primary" onClick={() => goToLogin()}>
          Iniciar sesión con otro usuario
        </Button>,
        <Button key="back" onClick={() => goBack()}>
          Regresar
        </Button>,
      ]}
    />
  );
};

export default AccessDenied;
