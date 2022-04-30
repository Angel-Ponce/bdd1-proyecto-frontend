/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";

import { Sale, setSales } from "$store/slices/salesSlice";
import to from "await-to-ts";
import axios from "axios";
import { api } from "$config/site";
import toast from "react-hot-toast";

const SalesTable: FC = () => {
  const dispatch = useAppDispatch();
  const sales = useAppSelector((state) => state.sales.sales);

  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);

  const columns: ColumnsType<Sale> = [
    {
      title: "Total",
      dataIndex: "total",
      width: "150px",
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
