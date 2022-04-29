/* eslint-disable no-unused-vars */
import { Product } from "$store/slices/productsSlice";
import { Button, Input, Typography } from "antd";
import { useFormik } from "formik";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { ShoppingOutlined } from "@ant-design/icons";

interface Props {
  modalType: "create" | "edit";
  product: Product | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

interface PresentationForm {
  name: string;
  stock: number | undefined;
  quantityInPresentation: number | undefined;
  salePrice: number | undefined;
  itemId: string;
  color: string;
}

const CreatePresentation: FC<Props> = ({
  modalType,
  product,
  setShowModal,
}) => {
  const { Text } = Typography;

  const [savingPresentation, setSavingPresentation] = useState<boolean>(false);

  const presentationForm = useFormik<PresentationForm>({
    initialValues: {
      name: "",
      stock: undefined,
      quantityInPresentation: undefined,
      salePrice: undefined,
      itemId: "",
      color: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.name) {
        errors.name = "El campo Nombre es obligatorio.";
      }

      if (!values.stock) {
        errors.stock = "El campo Stock es obligatorio.";
      }

      if (!values.quantityInPresentation) {
        errors.quantityInPresentation =
          "El campo Unidades por presentación es obligatorio.";
      }

      if (!values.salePrice) {
        errors.salePrice = "El campo Precio de venta es obligatorio.";
      }

      if (!values.color) {
        errors.color = "El campo Color es obligatorio.";
      }
    },
    onSubmit: async (values) => {},
    validateOnChange: true,
  });

  return (
    <div>
      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingPresentation}
          status={
            presentationForm.touched.name && presentationForm.errors.name
              ? "error"
              : undefined
          }
          type={"text"}
          name="name"
          placeholder="Nombre de la presentación"
          prefix={<ShoppingOutlined />}
          onChange={presentationForm.handleChange}
          value={presentationForm.values.name}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {presentationForm.touched.name && presentationForm.errors.name
            ? presentationForm.errors.name
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingPresentation}
          status={
            presentationForm.touched.stock && presentationForm.errors.stock
              ? "error"
              : undefined
          }
          type={"number"}
          name="stock"
          placeholder="Stock actual"
          onChange={presentationForm.handleChange}
          value={presentationForm.values.stock}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {presentationForm.touched.stock && presentationForm.errors.stock
            ? presentationForm.errors.stock
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingPresentation}
          status={
            presentationForm.touched.quantityInPresentation &&
            presentationForm.errors.quantityInPresentation
              ? "error"
              : undefined
          }
          type={"number"}
          name="quantityInPresentation"
          placeholder="Cantidad de unidades por presentación"
          onChange={presentationForm.handleChange}
          value={presentationForm.values.quantityInPresentation}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {presentationForm.touched.quantityInPresentation &&
          presentationForm.errors.quantityInPresentation
            ? presentationForm.errors.quantityInPresentation
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingPresentation}
          status={
            presentationForm.touched.salePrice &&
            presentationForm.errors.salePrice
              ? "error"
              : undefined
          }
          type={"number"}
          name="salePrice"
          placeholder="Precio de venta"
          prefix={"Q"}
          suffix={"GTQ"}
          onChange={presentationForm.handleChange}
          value={presentationForm.values.salePrice}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {presentationForm.touched.salePrice &&
          presentationForm.errors.salePrice
            ? presentationForm.errors.salePrice
            : undefined}
        </Text>
      </div>

      <div className="flex gap-2">
        <Button
          disabled={savingPresentation}
          onClick={() => setShowModal(false)}
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          loading={savingPresentation}
          onClick={() => presentationForm.handleSubmit()}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CreatePresentation;
