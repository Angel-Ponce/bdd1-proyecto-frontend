import { FC } from "react";
import { Result, Button } from "antd";
const AccessDenied: FC = () => {
  const handleGoBackToHome = () => {
    console.log("ok");
  };

  return (
    <Result
      status="error"
      title="Acceso denegado"
      subTitle="¡Oops! Parece que no tienes acceso a este módulo. Consulta con tu administrador si crees que esto es una equivocación."
      extra={
        <Button type="primary" onClick={() => handleGoBackToHome()}>
          Volver a inicio
        </Button>
      }
    />
  );
};

export default AccessDenied;
