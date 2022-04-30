/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import { Avatar, Card, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { Sale, setSales } from "$store/slices/salesSlice";
import to from "await-to-ts";
import axios from "axios";
import { api } from "$config/site";
import toast from "react-hot-toast";
import { formatDate } from "$helpers/formatDate";
import { formatCurrency } from "$helpers/formatCurrency";
import { BarcodeOutlined } from "@ant-design/icons";
import { insertSymbolAtPosition } from "$helpers/insertCommaAtPosition";
import Zoom from "react-medium-image-zoom";

const SalesTable: FC = () => {
  const { Title, Text } = Typography;

  const dispatch = useAppDispatch();
  const sales = useAppSelector((state) => state.sales.sales);

  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);

  const columns: ColumnsType<Sale> = [
    {
      title: "Fecha",
      dataIndex: "sale_date",
      width: "200px",
      render: (value: string) => <>{formatDate(value)}</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "200px",
      render: (value: number) => <>{formatCurrency(value)}</>,
    },
    {
      title: "Factura",
      dataIndex: "invoice",
      width: "320px",
      render: (value: string) => (
        <>
          <Tag icon={<BarcodeOutlined />} color="default">
            {value}
          </Tag>
        </>
      ),
    },
    {
      title: "Emitida por",
      dataIndex: "user",
      width: "360px",
      render: (value) => (
        <>
          <div className="flex items-center gap-3">
            <Avatar
              src={`https://avatars.dicebear.com/api/initials/${value.name}.svg`}
            />
            <div className="flex flex-col">
              <p className="!m-0 !mb-1">{value.name}</p>
              <p className="!m-0">{value?.email || ""}</p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      width: "360px",
      render: (value) => (
        <>
          <div className="flex items-center gap-3">
            <Avatar
              src={`https://avatars.dicebear.com/api/initials/${value.name}.svg`}
            />
            <div className="flex flex-col">
              <p className="!m-0 !mb-1">{value.name}</p>
              <p className="!m-0">
                {value.nit ? insertSymbolAtPosition(value.nit, 6, "-") : "-"}
              </p>
            </div>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    const getSales = async () => {
      setLoading(true);
      const [err, res] = await to(
        axios.get(`${api}/sales`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        toast.error("Error al obtener las ventas", {
          position: "bottom-right",
        });
      }

      if (res.data.sales) {
        dispatch(setSales(res.data.sales));
        setLoading(false);
      }
    };

    if (sales.length == 0) {
      getSales();
    }
  }, [dispatch, sales.length, user.token]);

  return (
    <>
      <Table
        pagination={{ pageSize: 10 }}
        loading={loading}
        columns={columns}
        dataSource={sales}
        bordered
        scroll={{ y: 560 }}
        expandable={{
          expandedRowRender: (sale: Sale) => (
            <div className="flex gap-6 p-2">
              {sale.items_bought.map((soldProduct, index) => {
                return (
                  <div key={index}>
                    <Card
                      style={{ width: 240 }}
                      cover={
                        <Zoom zoomMargin={20}>
                          <img
                            alt={soldProduct.item.name}
                            src={soldProduct.item.image_link}
                          />
                        </Zoom>
                      }
                    >
                      <Card.Meta
                        title={soldProduct.item.name}
                        description={
                          <div className="flex flex-col">
                            <Title level={3}>
                              Subtotal: {formatCurrency(soldProduct.subtotal)}
                            </Title>
                            <div className="flex flex-wrap gap-2 mb-1">
                              <Text>Presentación:</Text>
                              <Tag color={soldProduct.presentation.color}>
                                {soldProduct.presentation.name}
                              </Tag>
                            </div>
                            <Text>
                              Cantidad comprada: {soldProduct.quantity}
                            </Text>
                            <Text>
                              Precio unitario:{" "}
                              {formatCurrency(soldProduct.sale_price)}
                            </Text>
                          </div>
                        }
                      />
                    </Card>
                  </div>
                );
              })}
            </div>
          ),
          rowExpandable: (sale) => sale.items_bought.length > 0,
        }}
      />
    </>
  );
};

export default SalesTable;
