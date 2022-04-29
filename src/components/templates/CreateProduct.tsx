import { useAppSelector } from "$hooks/useAppSelector";
import { Provider } from "$store/slices/providersSlice";
import { useFormik } from "formik";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Typography, Button, Input, Select } from "antd";
import { TagOutlined, CameraOutlined } from "@ant-design/icons";
import { Product } from "$store/slices/productsSlice";
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
}

const CreateProduct: FC<Props> = ({ product, setShowModal }) => {
  const providersState = useAppSelector((state) => state.providers.providers);

  const [savingProduct] = useState<boolean>(false);

  const [providers, setProviders] = useState<JSX.Element[]>([]);

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
        errors.price = "El campo Precio es obligatorio.";
      }

      if (!values.image) {
        errors.image = "El campo Imagen es obligatorio.";
      }

      if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.image)) {
        errors.image = "El campo Imagen debe ser una URL valida.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      // setSavingProduct(true);
      // const [, res] = await to(
      //   axios.put(
      //     `${api}//edit/${provider?.id}`,
      //     {
      //       email: values.email,
      //       name: values.name,
      //       phone: values.phone,
      //       address: values.address,
      //     },
      //     {
      //       headers: {
      //         "X-Token": user.token,
      //       },
      //     }
      //   )
      // );
      // if (res) {
      //   toast.success("Proveedor actualizado correctamente", {
      //     position: "bottom-right",
      //   });
      //   dispatch(
      //     updateProvider({
      //       name: values.name,
      //       email: values.email,
      //       phone: values.phone,
      //       address: values.address,
      //       id: provider?.id || "",
      //     })
      //   );
      //   productForm.resetForm();
      // }
      // setsavingProduct(false);
      // setShowModal(false);
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
          placeholder="Precio"
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
