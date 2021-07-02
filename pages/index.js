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
import Stock from "../components/stock";
import Orders from "../components/orders";
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

  let orders = await prisma.orders.findMany({});

  stocks = stocks.map((item) => {
    return {
      ...item,
      minute_prices_deltas: item.minute_prices_deltas || "",
      last_price_update_at: moment(item.last_price_update_at).toISOString(),
      macd_5_last_cross: moment(item.macd_5_last_cross).toISOString(),
      macd_d_last_cross: moment(item.macd_d_last_cross).toISOString(),
      macd_30_last_cross: moment(item.macd_30_last_cross).toISOString(),
    };
  });

  orders = orders.map((item) => {
    return {
      ...item,
      description: item.description || "",
      created_at: moment(item.created_at).toISOString(),
      updated_at: moment(item.updated_at).toISOString(),
    };
  });

  const timeNY = moment().utcOffset(-4);
  return { props: { orders, stocks, timeNY: timeNY.format("HH:mm") } };
}

export default function Home(props) {
  const router = useRouter();

  const [stocks, setStocks] = useState(props.stocks);
  const [orders, setOrders] = useState(props.orders);
  const [stock, setStock] = useState();
  const [timeNY, setTimeNY] = useState("");

  function connect() {
    var host = process.env.NEXT_PUBLIC_WS_API_URL.replace(/^http/, "ws");
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
      setTimeNY(moment(data.time).utcOffset(-4).format("HH:mm:ss"));

      const newStocks = stocks.map((stock) => {
        if (data.stocks[stock.name] != null) {
          stock = data.stocks[stock.name];
        }
        return stock;
      });
      setStocks(newStocks);

      data.orders = data.orders.map((item) => {
        return {
          ...item,
          timeAgo: moment().diff(moment(item.updated_at), "s"),
        };
      });
      data.orders.sort((a, b) => {
        if (a.timeAgo > b.timeAgo) return 1;
        else if (b.timeAgo > a.timeAgo) return -1;
        return 0;
      });

      setOrders(data.orders);
    };
  }

  useEffect(() => {
    setStocks(props.stocks);
    connect();
  }, []);

  function onSelectStock(stonk) {
    setStock(stonk);
  }

  return (
    <div className="">
      <Head>
        <title>RodriguezLab Stocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="pings"></div>

      <Layout timeNY={timeNY}>
        <div className="flex-1 flex items-stretch overflow-hidden">
          <main className="sm:block flex-1 overflow-y-auto">
            {/* Primary column */}
            <section
              aria-labelledby="primary-heading"
              className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
            >
              <StockList onSelectStock={onSelectStock} stocks={stocks} />
            </section>
          </main>

          {/* Secondary column (hidden on smaller screens) */}
          <aside className=" p-5 w-96 hidden lg:block bg-white border-l border-gray-200 overflow-y-auto overflow-x-hidden ">
            {stock && <Stock stock={stock} />}
            <Orders stocks={stocks} orders={orders} />
          </aside>
        </div>
      </Layout>
    </div>
  );
}
