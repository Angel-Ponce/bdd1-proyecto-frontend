import type { NextPage } from "next";
import Head from "next/head";
import Header from "$templates/Header";
import { api, pageTitle } from "$config/site";
import AccessDenied from "$templates/AccessDenied";
import { useLogin } from "$hooks/useLogin";
import { Avatar, Breadcrumb, Card, Statistic } from "antd";
import Link from "next/link";
import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";
import {
  ItemsByProvider,
  ItemsSelled,
  SalesByMonth,
  setReport,
} from "$store/slices/reportSlice";
import { useEffect, useState } from "react";
import to from "await-to-ts";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowUpOutlined } from "@ant-design/icons";
import { formatCurrency } from "$helpers/formatCurrency";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { dynamicColors } from "$helpers/dynamicRgbColors";
import { ES_MONTHS } from "$helpers/formatDate";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Reports: NextPage = () => {
  const [isLoggedIn, mounted] = useLogin();
  const [loading, setLoading] = useState<boolean>(false);
  const [itemsByProvider, setItemsByProvider] = useState<ItemsByProvider[]>([]);
  const [topItemsSelled, setTopItemsSelled] = useState<ItemsSelled[]>([]);
  const [salesByMonth, setSalesByMonth] = useState<SalesByMonth[]>([]);

  const report = useAppSelector((state) => state.report);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const configChartItemsByProvider = {
    labels: itemsByProvider.map((d) => d.name),
    datasets: [
      {
        label: "Productos por proveedor",
        data: itemsByProvider.map((d) => d.items_count),
        backgroundColor: itemsByProvider.map((i) => dynamicColors()),
      },
    ],
  };

  const configChartTopItemsSelled = {
    labels: topItemsSelled.map((d) => d.name),
    datasets: [
      {
        label: "Top 10 productos más vendidos",
        data: topItemsSelled.map((d) => d.details_count),
        backgroundColor: ["#337bb8"],
      },
    ],
  };

  const configChartSalesByMonth = {
    labels: salesByMonth.map((d) => ES_MONTHS[d.month]),
    datasets: [
      {
        label: "Ventas por mes",
        data: salesByMonth.map((d) => d.total),
        backgroundColor: "#3be39e",
        borderColor: "#3be39e",
      },
    ],
  };

  useEffect(() => {
    const getReport = async () => {
      setLoading(true);
      const [err, res] = await to(
        axios.get(`${api}/reports`, {
          headers: {
            "X-Token": user.token,
          },
        })
      );

      if (err) {
        toast.error("Error al obtener los reportes", {
          position: "bottom-right",
        });
      }

      if (res.data.report) {
        dispatch(setReport(res.data.report));
        setItemsByProvider(res.data.report.items_by_provider || []);
        setTopItemsSelled(res.data.report.items_selled || []);
        setSalesByMonth(res.data.report.sales_by_month || []);
        setLoading(false);
      }
    };
    if (!report.best_seller.id) {
      getReport();
    }
  }, [dispatch, report.best_seller.id, user.token]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />

      <div className="w-full flex flex-col items-center">
        {mounted && (
          <div className="container mb-8">
            {isLoggedIn ? (
              <>
                <div className="h-16 flex items-center w-full">
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link href="/">
                        <a>Inicio</a>
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link href="/reports">
                        <a>Reportes</a>
                      </Link>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className="flex justify-around items-center p-5 gap-5 flex-wrap">
                  <Card>
                    <Statistic
                      style={{ width: 250 }}
                      title="Ventas"
                      value={report.sales_count || 0}
                      loading={loading}
                      precision={0}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined className="-translate-y-1.5" />}
                      suffix="Este mes"
                    />
                  </Card>
                  <Card>
                    <Statistic
                      style={{ width: 250 }}
                      title="Ganancias"
                      value={formatCurrency(report.sales_earnings || 0)}
                      loading={loading}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined className="-translate-y-1.5" />}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      style={{ width: 250 }}
                      title="Vendedor del mes"
                      value={report.best_seller.name || ""}
                      loading={loading}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={
                        <>
                          <div className="mr-2">
                            <Avatar
                              src={`https://avatars.dicebear.com/api/initials/${report.best_seller.name}.svg`}
                            />
                          </div>
                        </>
                      }
                    />
                  </Card>
                </div>
                <div className="mt-10 flex flex-wrap gap-10 items-stretch justify-center">
                  <div className="w-full max-w-sm">
                    <Pie data={configChartItemsByProvider} />;
                  </div>
                  <div className="w-full max-w-2xl">
                    <Line data={configChartSalesByMonth} />
                  </div>
                </div>
                <div className="flex justify-center w-full mt-8">
                  <div className="w-full max-w-2xl">
                    <Bar data={configChartTopItemsSelled} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center w-full min-h-[calc(100vh-4rem)]">
                <AccessDenied />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;