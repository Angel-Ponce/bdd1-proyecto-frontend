import type { NextPage } from "next";
import Head from "next/head";
import Header from "$templates/Header";
import { api, pageTitle } from "$config/site";
import AccessDenied from "$templates/AccessDenied";
import { useLogin } from "$hooks/useLogin";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { useAppSelector } from "$hooks/useAppSelector";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { setReport } from "$store/slices/reportSlice";
import { useEffect, useState } from "react";
import to from "await-to-ts";
import axios from "axios";
import toast from "react-hot-toast";

const Reports: NextPage = () => {
  const [isLoggedIn, mounted] = useLogin();
  const [loading, setLoading] = useState<boolean>(false);

  const report = useAppSelector((state) => state.report);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

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
        dispatch(setReport(res.data));
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
                {loading}
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
