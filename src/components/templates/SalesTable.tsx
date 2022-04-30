/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import { Avatar, Table, Tag } from "antd";
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

const SalesTable: FC = () => {
  const dispatch = useAppDispatch();
  const sales = useAppSelector((state) => state.sales.sales);

  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);

  const columns: ColumnsType<Sale> = [
    {
      title: "Fecha",
      dataIndex: "sale_date",
      width: "50px",
      render: (value: string) => <>{formatDate(value)}</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "50px",
      render: (value: number) => <>{formatCurrency(value)}</>,
    },
    {
      title: "Factura",
      dataIndex: "invoice",
      width: "150px",
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
      width: "150px",
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
      width: "150px",
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
          expandedRowRender: (sale) => (
            <p style={{ margin: 0 }}>{sale.total}</p>
          ),
          rowExpandable: (sale) => sale.total > 0,
        }}
      />
    </>
  );
};

export default SalesTable;
