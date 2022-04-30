/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { Table, Tag, Button, Modal, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  Presentation,
  Product,
  removeProduct,
} from "$store/slices/productsSlice";
import { PlusOutlined } from "@ant-design/icons";
import { formatCurrency } from "$helpers/formatCurrency";
import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";
import to from "await-to-ts";
import axios from "axios";
import { api } from "$config/site";
import toast from "react-hot-toast";
import CreateProduct from "$organisms/CreateProduct";
import Zoom from "react-medium-image-zoom";
import CreatePresentation from "$organisms/CreatePresentation";

const ProductsTable: FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const loadingProducts = useAppSelector((state) => state.products.loading);
  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);

  const [showEditProductModal, setShowEditProductModal] =
    useState<boolean>(false);

  const [showCreatePresentationModal, setShowPresentationModal] =
    useState<boolean>(false);

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentPresentation, setCurrentPresentation] =
    useState<Presentation | null>(null);

  const [typeOfPresentationModal, setTypeOfPresentationModal] = useState<
    "create" | "edit"
  >("create");

  const columns: ColumnsType<Product> = [
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
      title: "Presentaciones",
      width: "200px",
      dataIndex: "",
      render: (value: Product) => (
        <>
          <div className="flex gap-2 flex-wrap">
            {value.presentations.map((presentation: Presentation) => {
              return (
                <Tooltip
                  key={presentation.id}
                  title="Haz clic para editar esta presentación"
                >
                  <Tag
                    color={presentation.color}
                    onClick={() => {
                      setCurrentPresentation(presentation);
                      setTypeOfPresentationModal("edit");
                      setCurrentProduct(value);
                      setShowPresentationModal(true);
                    }}
                    className="cursor-pointer select-none"
                  >
                    {presentation.name}: {presentation.quantity}{" "}
                    {presentation.quantity > 1 ? "unidades" : "unidad"}
                  </Tag>
                </Tooltip>
              );
            })}

            <Tooltip title={"Agregar una nueva presentación"} color={"blue"}>
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setTypeOfPresentationModal("create");
                  setCurrentProduct(value);
                  setShowPresentationModal(true);
                }}
              />
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
        loading={loading || loadingProducts}
        columns={columns}
        dataSource={products}
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

      <Modal
        title={
          typeOfPresentationModal == "create"
            ? "Crear nueva presentación"
            : "Editar presentación"
        }
        closable={false}
        visible={showCreatePresentationModal}
        footer={null}
        destroyOnClose
        afterClose={() => {
          setCurrentProduct(null);
          setCurrentPresentation(null);
        }}
      >
        <CreatePresentation
          currentPresentation={currentPresentation}
          modalType={typeOfPresentationModal}
          product={currentProduct}
          setShowModal={setShowPresentationModal}
        />
      </Modal>
    </>
  );
};

export default ProductsTable;
