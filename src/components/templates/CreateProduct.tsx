import { useAppSelector } from "$hooks/useAppSelector";
import { Provider } from "$store/slices/providersSlice";
import { useFormik } from "formik";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Typography, Button, Input, Select } from "antd";
import { TagOutlined, CameraOutlined } from "@ant-design/icons";
import { addProduct, Product } from "$store/slices/productsSlice";
import axios from "axios";
import to from "await-to-ts";
import { api } from "$config/site";
import toast from "react-hot-toast";
import { useAppDispatch } from "$hooks/useAppDispatch";
const { Text } = Typography;

interface Props {
  product: Product | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number | undefined;
  image: string;
  provider: string;
  salePrice: number | undefined;
  initialStock: number | undefined;
}

const CreateProduct: FC<Props> = ({ product, setShowModal }) => {
  const providersState = useAppSelector((state) => state.providers.providers);
  const user = useAppSelector((state) => state.user);

  const [savingProduct, setSavingProduct] = useState<boolean>(false);

  const [providers, setProviders] = useState<JSX.Element[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (providersState.length != 0) {
      setProviders(
        providersState.map((provider: Provider) => {
          return (
            <Select.Option key={provider.id}>{provider.name}</Select.Option>
          );
        })
      );
    }
  }, [providersState]);

  const handleProviderChange = (value: string) => {
    productForm.setFieldTouched("provider", true);
    productForm.setFieldValue("provider", value);
  };

  const productForm = useFormik<ProductForm>({
    initialValues: {
      name: "",
      description: "",
      price: undefined,
      salePrice: undefined,
      initialStock: undefined,
      image: "",
      provider: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.name) {
        errors.name = "El campo Nombre es obligatorio.";
      }

      if (!values.description) {
        errors.description = "El campo Descripción es obligatorio.";
      }

      if (!values.price) {
        errors.price = "El campo Precio de compra a proveedor es obligatorio.";
      }

      if (!values.salePrice) {
        errors.salePrice = "El campo Precio de venta es obligatorio.";
      }

      if (!values.initialStock) {
        errors.initialStock = "El campo Stock inicial  es obligatorio.";
      }

      if (!values.image) {
        errors.image = "El campo Imagen es obligatorio.";
      }

      if (!values.provider) {
        errors.provider = "Debes seleccionar un proveedor. ";
      }

      if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.image)) {
        errors.image = "El campo Imagen debe ser una URL valida.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setSavingProduct(true);
      const [, res] = await to(
        axios.post(
          `${api}/items/create`,
          {
            name: values.name,
            description: values.description,
            image: values.image,
            price: values.price,
            provider: values.provider,
            stock: values.initialStock,
            salePrice: values.salePrice,
          },
          {
            headers: {
              "X-Token": user.token,
            },
          }
        )
      );
      if (res) {
        toast.success("Producto guardado correctamente", {
          position: "bottom-right",
        });
        dispatch(
          addProduct({
            id: res.data.id,
            key: res.data.id,
            description: values.description,
            image_link: values.image,
            name: values.name,
            presentations: res.data.presentations || [],
            provider: values.provider,
            purchase_price: values.price || 0,
          })
        );
        productForm.resetForm();
      }
      setSavingProduct(false);
      setShowModal(false);
    },
    validateOnChange: true,
  });

  // const { setValues } = productForm;

  // useEffect(() => {
  //   setValues({
  //     name: provider?.name || "",
  //     email: provider?.email || "",
  //     phone: provider?.phone || "",
  //     address: provider?.address || "",
  //   });
  // }, [setValues, provider]);

  return (
    <div>
      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingProduct}
          status={
            productForm.touched.name && productForm.errors.name
              ? "error"
              : undefined
          }
          type={"text"}
          name="name"
          placeholder="Nombre del producto"
          prefix={<TagOutlined />}
          onChange={productForm.handleChange}
          value={productForm.values.name}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.name && productForm.errors.name
            ? productForm.errors.name
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input.TextArea
          size="large"
          disabled={savingProduct}
          status={
            productForm.touched.description && productForm.errors.description
              ? "error"
              : undefined
          }
          name="description"
          placeholder="Descripción del producto"
          onChange={productForm.handleChange}
          value={productForm.values.description}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.description && productForm.errors.description
            ? productForm.errors.description
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingProduct}
          status={
            productForm.touched.price && productForm.errors.price
              ? "error"
              : undefined
          }
          type={"number"}
          name="price"
          placeholder="Precio de compra al proveedor"
          prefix={"Q"}
          suffix={"GTQ"}
          onChange={productForm.handleChange}
          value={productForm.values.price}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.price && productForm.errors.price
            ? productForm.errors.price
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingProduct}
          status={
            productForm.touched.salePrice && productForm.errors.salePrice
              ? "error"
              : undefined
          }
          type={"number"}
          name="salePrice"
          placeholder="Precio de venta por unidad"
          prefix={"Q"}
          suffix={"GTQ"}
          onChange={productForm.handleChange}
          value={productForm.values.salePrice}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.salePrice && productForm.errors.salePrice
            ? productForm.errors.salePrice
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingProduct}
          status={
            productForm.touched.initialStock && productForm.errors.initialStock
              ? "error"
              : undefined
          }
          type={"number"}
          name="initialStock"
          placeholder="Stock inicial"
          onChange={productForm.handleChange}
          value={productForm.values.initialStock}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.initialStock && productForm.errors.initialStock
            ? productForm.errors.initialStock
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Input
          size="large"
          disabled={savingProduct}
          status={
            productForm.touched.image && productForm.errors.image
              ? "error"
              : undefined
          }
          type={"text"}
          name="image"
          placeholder="URL de la imagen"
          prefix={<CameraOutlined />}
          onChange={productForm.handleChange}
          value={productForm.values.image}
        />
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.image && productForm.errors.image
            ? productForm.errors.image
            : undefined}
        </Text>
      </div>

      <div className="flex flex-col">
        <Select
          status={
            productForm.touched.provider && productForm.errors.provider
              ? "error"
              : undefined
          }
          size="large"
          allowClear
          placeholder="Selecciona un proeveedor"
          onChange={handleProviderChange}
        >
          {providers}
        </Select>
        <Text className="!text-red-600 mt-1 h-[22px]">
          {productForm.touched.provider && productForm.errors.provider
            ? productForm.errors.provider
            : undefined}
        </Text>
      </div>

      <div className="flex gap-2">
        <Button disabled={savingProduct} onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button
          type="primary"
          loading={savingProduct}
          onClick={() => productForm.handleSubmit()}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
