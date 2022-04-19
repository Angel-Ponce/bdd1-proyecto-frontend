import type { NextPage } from "next";
import Head from "next/head";
import { Button } from "antd";
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-red-600 text-3xl">Hello world</div>
      <Button type="primary">Hello world</Button>
    </div>
  );
};

export default Home;
