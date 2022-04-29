/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
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

const ProductsTable: FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);

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
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
    {
      title: "Precio",
      dataIndex: "purchase_price",
      render: (value) => `${formatCurrency(value)}`,
    },
    {
      title: "Imagen",
      dataIndex: "image_link",
      render: (value) => (
        <>
          <img src={value} alt={value} width={100} height={100} />
        </>
      ),
    },
    {
      title: "Presentaciones",
      dataIndex: "presentations",
      render: (presentations) => (
        <>
          {presentations.map((presentation: Presentation) => {
            return (
              <Tag color={presentation.color} key={presentation.id}>
                {presentation.name}: {presentation.quantity}{" "}
                {presentation.quantity > 1 ? "unidades" : "unidad"}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Proveedor",
      dataIndex: "provider",
    },
    {
      title: "Acción",
      dataIndex: "",
      key: "actions",
      render: (value) => (
        <div className="flex gap-3">
          <Button>Editar</Button>
          <Button danger>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      pagination={{ pageSize: 2 }}
      loading={loading}
      columns={columns}
      dataSource={products.products}
      bordered
    />
  );
};

export default ProductsTable;
