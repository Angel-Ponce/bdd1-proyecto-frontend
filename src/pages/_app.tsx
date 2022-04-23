import "../styles/globals.scss";
import "antd/dist/antd.css";
import { FC } from "react";
type AppProps = { Component: FC; pageProps: any };
import { Provider } from "react-redux";
import { store } from "$store/store";
import { Toaster } from "react-hot-toast";
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster />
    </Provider>
  );
};

export default MyApp;
