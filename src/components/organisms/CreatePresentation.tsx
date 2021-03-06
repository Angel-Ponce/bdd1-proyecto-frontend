import {
  Presentation,
  Product,
  updateProduct,
} from "$store/slices/productsSlice";
import { Button, Input, Popconfirm, Select, Typography } from "antd";
import { useFormik } from "formik";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { ShoppingOutlined } from "@ant-design/icons";
import to from "await-to-ts";
import axios from "axios";
import { api } from "$config/site";
import { useAppSelector } from "$hooks/useAppSelector";
import toast from "react-hot-toast";
import { useAppDispatch } from "$hooks/useAppDispatch";

interface Props {
  modalType: "create" | "edit";
  product: Product | null;
  currentPresentation: Presentation | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

interface PresentationForm {
  name: string;
  stock: number | undefined;
  quantityInPresentation: number | undefined;
  salePrice: number | undefined;
  color: string;
}

const CreatePresentation: FC<Props> = ({
  modalType,
  product,
  currentPresentation,
  setShowModal,
}) => {
  const { Text } = Typography;

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [savingPresentation, setSavingPresentation] = useState<boolean>(false);

  const presentationForm = useFormik<PresentationForm>({
    initialValues: {
      name: "",
      stock: undefined,
      quantityInPresentation: undefined,
      salePrice: undefined,
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

      return errors;
    },
    onSubmit: async (values) => {
      setSavingPresentation(true);

      if (modalType == "create") {
        const [, res] = await to(
          axios.post(
            `${api}/presentations/create/${product?.id}`,
            {
              name: values.name,
              stock: values.stock,
              quantity: values.quantityInPresentation,
              price: values.salePrice,
              color: values.color,
            },
            {
              headers: {
                "X-Token": user.token,
              },
            }
          )
        );
        if (res) {
          toast.success("Presentación guardada correctamente", {
            position: "bottom-right",
          });

          if (!product) return;

          dispatch(
            updateProduct({
              ...product,
              presentations: [...res.data.presentations],
            })
          );

          presentationForm.resetForm();
        }
      } else {
        const [, res] = await to(
          axios.put(
            `${api}/presentations/edit/${currentPresentation?.id}`,
            {
              name: values.name,
              stock: values.stock,
              quantity: values.quantityInPresentation,
              price: values.salePrice,
              color: values.color,
            },
            {
              headers: {
                "X-Token": user.token,
              },
            }
          )
        );
        if (res) {
          toast.success("Presentación guardada correctamente", {
            position: "bottom-right",
          });

          if (!product) return;

          dispatch(
            updateProduct({
              ...product,
              presentations: [...res.data.presentations],
            })
          );

          presentationForm.resetForm();
        }
      }

      setSavingPresentation(false);
      setShowModal(false);
    },
    validateOnChange: true,
  });

  const handleColorChange = (value: string) => {
    presentationForm.setFieldTouched("color", true);
    presentationForm.setFieldValue("color", value);
  };

  const { setValues } = presentationForm;
  useEffect(() => {
    if (modalType == "edit") {
      setValues({
        name: currentPresentation?.name || "",
        stock: currentPresentation?.stock,
        quantityInPresentation: currentPresentation?.quantity,
        salePrice: currentPresentation?.sale_price,
        color: currentPresentation?.color || "",
      });
    }
  }, [modalType, setValues, currentPresentation]);

  const handleDelete = async () => {
    setSavingPresentation(true);
    if (!currentPresentation) return;

    const [, res] = await to(
      axios.delete(`${api}/presentations/delete/${currentPresentation?.id}`, {
        headers: {
          "X-Token": user.token,
        },
      })
    );

    if (res) {
      toast.success("Presentación eliminada correctamente", {
        position: "bottom-right",
      });

      if (!product) return;

      dispatch(
        updateProduct({
          ...product,
          presentations: [...res.data.presentations],
        })
      );

      setShowModal(false);
    }
    setSavingPresentation(false);
  };

  return (
    <div>
      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingPresentation || currentPresentation?.is_unit}
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
          disabled={savingPresentation || currentPresentation?.is_unit}
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

      <div className="flex flex-col">
        <Select
          onChange={handleColorChange}
          size="large"
          status={
            presentationForm.touched.color && presentationForm.errors.color
              ? "error"
              : undefined
          }
          placeholder="Color de la etiqueta"
          allowClear
          defaultValue={
            modalType == "edit" ? currentPresentation?.color || "" : undefined
          }
          disabled={currentPresentation?.is_unit}
          options={[
            { value: "magenta", label: "Magenta" },
            { value: "red", label: "Rojo" },
            { value: "volcano", label: "Volcán" },
            { value: "orange", label: "Naranja" },
            { value: "gold", label: "Dorado" },
            { value: "green", label: "Verde" },
            { value: "lime", label: "Lima" },
            { value: "cyan", label: "Cian" },
            { value: "blue", label: "Azul" },
            { value: "geekblue", label: "Azul geek" },
            { value: "purple", label: "Morado" },
          ]}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {presentationForm.touched.color && presentationForm.errors.color
            ? presentationForm.errors.color
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

        {modalType == "edit" && !currentPresentation?.is_unit ? (
          <Popconfirm
            title="¿Estás seguro de borrar esta presentación?"
            onConfirm={() => {
              handleDelete();
            }}
            onCancel={() => {}}
            okText="Si"
            cancelText="No"
          >
            <Button danger disabled={savingPresentation}>
              Borrar
            </Button>
          </Popconfirm>
        ) : null}

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
