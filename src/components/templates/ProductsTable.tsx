/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  Presentation,
  Product,
  removeProduct,
  setProducts,
} from "$store/slices/productsSlice";
import { PlusOutlined } from "@ant-design/icons";
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

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

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
                <Tooltip
                  key={presentation.id}
                  title="Haz clic para editar esta presentación"
                  color={"cyan"}
                >
                  <Tag
                    color={presentation.color}
                    onClick={() => {
                      console.log("asdda");
                    }}
                    className="cursor-pointer select-none"
                  >
                    {presentation.name}: {presentation.quantity}{" "}
                    {presentation.quantity > 1 ? "unidades" : "unidad"}
                  </Tag>
                </Tooltip>
              );
            })}

            <Tooltip title="Agregar una nueva presentación" color={"blue"}>
              <Button size="small" icon={<PlusOutlined />} />
            </Tooltip>
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
              setCurrentProduct(value);
              setShowEditProductModal(true);
            }}
          >
            Editar
          </Button>

          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            onConfirm={() => {
              deleteProduct(value.id);
            }}
            onCancel={() => {}}
            okText="Si"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const deleteProduct = async (id: string) => {
    setLoading(true);

    const [, res] = await to(
      axios.delete(`${api}/items/delete/${id}`, {
        headers: {
          "X-Token": user.token,
        },
      })
    );
    if (res) {
      toast.success("Producto eliminado correctamente", {
        position: "bottom-right",
      });
      dispatch(removeProduct({ id: id }));
    }

    setLoading(false);
  };

  return (
    <>
      <Table
        pagination={{ pageSize: 10 }}
        loading={loading}
        columns={columns}
        dataSource={products.products}
        bordered
        scroll={{ y: 560 }}
        expandable={{
          expandedRowRender: (product) => (
            <p style={{ margin: 0 }}>{product.description}</p>
          ),
          rowExpandable: (product) => product.description.length > 0,
        }}
      />
      <Modal
        title="Editar producto"
        closable={false}
        visible={showEditProductModal}
        footer={null}
        destroyOnClose
        afterClose={() => {
          setCurrentProduct(null);
        }}
      >
        <CreateProduct
          modalType="edit"
          product={currentProduct}
          setShowModal={setShowEditProductModal}
        />
      </Modal>
    </>
  );
};

export default ProductsTable;
