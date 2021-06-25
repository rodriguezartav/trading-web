import { useState } from "react";
import Head from "next/head";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  BookmarkAltIcon,
  FireIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";
import prisma from "../lib/prisma";
import moment from "moment";
import { useRouter } from "next/router";

import StockList from "../components/stockList";
import Layout from "../components/layout";
import { useEffect } from "react";

export async function getServerSideProps() {
  let stocks = await prisma.stocks.findMany({
    orderBy: [
      {
        importance: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  stocks = stocks.map((item) => {
    return {
      ...item,
      last_price_update_at: moment(item.last_price_update_at).toISOString(),
      macd_5_last_cross: moment(item.macd_5_last_cross).toISOString(),
      macd_d_last_cross: moment(item.macd_d_last_cross).toISOString(),
    };
  });
  const timeNY = moment().utcOffset(-4);
  return { props: { stocks, timeNY: timeNY.format("HH:mm") } };
}

export default function Home(props) {
  const router = useRouter();

  const [stocks, setStocks] = useState(props.stocks);
  const [timeNY, setTimeNY] = useState("");

  function connect() {
    var host = location.origin.replace(/^http/, "ws").replace("3000", "5000");
    var ws = new WebSocket(host);

    ws.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      setTimeout(function () {
        connect();
      }, 1000);
    };

    ws.onerror = function (err) {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      ws.close();
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setTimeNY(moment(data.time).format("HH:mm:ss"));
      const newStocks = stocks.map((stock) => {
        if (data[stock.name] != null) {
          stock = data[stock.name];
        }
        return stock;
      });
      setStocks(newStocks);
    };
  }

  useEffect(() => {
    setStocks(props.stocks);
    connect();
  }, []);

  return (
    <div className="">
      <Head>
        <title>RodriguezLab Stocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="pings"></div>

      <Layout timeNY={timeNY}>
        <div className="flex-1 flex items-stretch overflow-hidden">
          <main className="hidden lg:block flex-1 overflow-y-auto">
            {/* Primary column */}
            <section
              aria-labelledby="primary-heading"
              className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
            >
              <StockList stocks={stocks} />
            </section>
          </main>

          {/* Secondary column (hidden on smaller screens) */}
          <aside className=" w-96 bg-white border-l border-gray-200 overflow-y-auto overflow-x-hidden "></aside>
        </div>
      </Layout>
    </div>
  );
}
