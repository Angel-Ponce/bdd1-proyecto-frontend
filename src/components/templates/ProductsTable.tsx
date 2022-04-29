/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  Presentation,
  Product,
  setProducts,
} from "$store/slices/productsSlice";
import { formatCurrency } from "$helpers/formatCurrency";
import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";
import to from "await-to-ts";
import axios from "axios";
import { api } from "$config/site";
import toast from "react-hot-toast";
import CreateProduct from "./CreateProduct";
import Zoom from "react-medium-image-zoom";

const ProductsTable: FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);

  const [showEditProductModal, setShowEditProductModal] =
    useState<boolean>(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const [err, res] = await to(
        axios.get(`${api}/items`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        toast.error("Error al obtener los productos", {
          position: "bottom-right",
        });
      }
      dispatch(setProducts(res.data.items));
      setLoading(false);
    };

    if (products?.products?.length == 0) {
      getProducts();
    }
  }, [dispatch, products, user]);

  const columns: ColumnsType<Product> = [
    {
      title: "Nombre",
      dataIndex: "name",
      width: "150px",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      width: "170px",
    },
    {
      title: "Precio de compra al proveedor",
      width: "150px",
      dataIndex: "purchase_price",
      render: (value) => `${formatCurrency(value)}`,
    },
    {
      title: "Imagen",
      width: "150px",
      dataIndex: "image_link",
      render: (value) => (
        <>
          <Zoom zoomMargin={20}>
            <img src={value} alt={value} width={60} height={60} />
          </Zoom>
        </>
      ),
    },
    {
      title: "Presentaciones",
      width: "200px",
      dataIndex: "presentations",
      render: (presentations) => (
        <>
          <div className="flex gap-2 flex-wrap">
            {presentations.map((presentation: Presentation) => {
              return (
                <Tag color={presentation.color} key={presentation.id}>
                  {presentation.name}: {presentation.quantity}{" "}
                  {presentation.quantity > 1 ? "unidades" : "unidad"}
                </Tag>
              );
            })}
          </div>
        </>
      ),
    },
    {
      title: "Proveedor",
      width: "150px",
      dataIndex: "provider",
    },
    {
      title: "Acción",
      width: "200px",
      dataIndex: "",
      key: "actions",
      render: (value: Product) => (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              console.log(value);
            }}
          >
            Editar
          </Button>
          <Button danger>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        pagination={{ pageSize: 10 }}
        loading={loading}
        columns={columns}
        dataSource={products.products}
        bordered
        scroll={{ y: 560 }}
      />
      <Modal
        title="Editar producto"
        closable={false}
        visible={showEditProductModal}
        footer={null}
        destroyOnClose
      >
        <CreateProduct product={null} setShowModal={setShowEditProductModal} />
      </Modal>
    </>
  );
};

export default ProductsTable;
