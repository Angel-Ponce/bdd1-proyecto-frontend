import { api } from "$config/site";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { useAppSelector } from "$hooks/useAppSelector";
import { Provider, updateProvider } from "$store/slices/providersSlice";
import to from "await-to-ts";
import axios from "axios";
import { useFormik } from "formik";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Typography, Button, Input } from "antd";
import {
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ProviderForm } from "src/pages/providers";
const { Text } = Typography;

interface Props {
  provider: Provider | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const EditProvider: FC<Props> = ({ provider, setShowModal }) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);

  const [updatingProvider, setUpdatingProvider] = useState<boolean>(false);

  const editProviderForm = useFormik<ProviderForm>({
    initialValues: {
      name: "",
      email: "",
      phone: undefined,
      address: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.name) {
        errors.name = "El campo Nombre es obligatorio.";
      }

      if (!values.email) {
        errors.email = "El campo Correo Electrónico es obligatorio.";
      }

      if (!values.phone) {
        errors.phone = "El campo Teléfono es obligatorio.";
      }

      if (!values.phone) {
        errors.phone = "El campo Teléfono es obligatorio.";
      }

      if (!values.address) {
        errors.address = "El campo Dirección es obligatorio.";
      }

      if (values.phone && !values.phone.toString().match(/^\d{8}$/)) {
        errors.phone = "El campo Teléfono debe contener 8 dígitos.";
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
      setUpdatingProvider(true);
      const [, res] = await to(
        axios.put(
          `${api}/providers/edit/${provider?.id}`,
          {
            email: values.email,
            name: values.name,
            phone: values.phone,
            address: values.address,
          },
          {
            headers: {
              "X-Token": user.token,
            },
          }
        )
      );
      if (res) {
        toast.success("Proveedor actualizado correctamente", {
          position: "bottom-right",
        });
        dispatch(
          updateProvider({
            name: values.name,
            email: values.email,
            phone: values.phone?.toString() || "",
            address: values.address,
            id: provider?.id || "",
          })
        );
        editProviderForm.resetForm();
      }
      setUpdatingProvider(false);
      setShowModal(false);
    },
    validateOnChange: true,
  });

  const { setValues } = editProviderForm;

  useEffect(() => {
    setValues({
      name: provider?.name || "",
      email: provider?.email || "",
      phone: Number(provider?.phone) || undefined,
      address: provider?.address || "",
    });
  }, [setValues, provider]);

  return (
    <div>
      <div className="flex flex-col">
        <Input
          disabled={updatingProvider}
          status={
            editProviderForm.touched.name && editProviderForm.errors.name
              ? "error"
              : undefined
          }
          type={"text"}
          name="name"
          placeholder="Nombre del proveedor"
          prefix={<UserOutlined />}
          onChange={editProviderForm.handleChange}
          value={editProviderForm.values.name}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {editProviderForm.touched.name && editProviderForm.errors.name
            ? editProviderForm.errors.name
            : undefined}
        </Text>
      </div>
      <div className="flex flex-col">
        <Input
          disabled={updatingProvider}
          status={
            editProviderForm.touched.email && editProviderForm.errors.email
              ? "error"
              : undefined
          }
          type={"email"}
          name="email"
          placeholder="Correo electrónico"
          prefix={<MailOutlined />}
          onChange={editProviderForm.handleChange}
          value={editProviderForm.values.email}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {editProviderForm.touched.email && editProviderForm.errors.email
            ? editProviderForm.errors.email
            : undefined}
        </Text>
      </div>
      <div className="flex flex-col">
        <Input
          disabled={updatingProvider}
          status={
            editProviderForm.touched.phone && editProviderForm.errors.phone
              ? "error"
              : undefined
          }
          type={"tel"}
          name="phone"
          showCount
          maxLength={8}
          placeholder="Número telefónico "
          prefix={<PhoneOutlined />}
          onChange={editProviderForm.handleChange}
          value={editProviderForm.values.phone}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {editProviderForm.touched.phone && editProviderForm.errors.phone
            ? editProviderForm.errors.phone
            : undefined}
        </Text>
      </div>
      <div className="flex flex-col">
        <Input
          disabled={updatingProvider}
          status={
            editProviderForm.touched.address && editProviderForm.errors.address
              ? "error"
              : undefined
          }
          type={"text"}
          name="address"
          placeholder="Dirección"
          prefix={<EnvironmentOutlined />}
          onChange={editProviderForm.handleChange}
          value={editProviderForm.values.address}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {editProviderForm.touched.address && editProviderForm.errors.address
            ? editProviderForm.errors.address
            : undefined}
        </Text>
      </div>
      <div className="flex gap-2">
        <Button disabled={updatingProvider} onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button
          type="primary"
          loading={updatingProvider}
          onClick={() => editProviderForm.handleSubmit()}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default EditProvider;
