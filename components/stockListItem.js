import {
  LineChart,
  Line,
  Tooltip,
  YAxis,
  XAxis,
  ReferenceLine,
  BarChart,
  Bar,
  RadialBarChart,
  Legend,
  RadialBar,
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import React from "react";

export default function StockList(props) {
  const [prices, setPrices] = React.useState([]);
  const [monthPrices, setMonthPrices] = React.useState([]);
  const [minutePrices, setMinutePrices] = React.useState([]);

  React.useEffect(() => {
    let stock = props.stock;

    let prices = stock.today_prices
      .trim()
      .split(",")
      .filter((item) => item != null)
      .map((item, index) => {
        return {
          index,
          openPrice: stock.price_today_open,
          price: parseInt(item * 100) / 100,
        };
      });

    if (stock.price && prices.length > 1) prices.push({ price: stock.price });

    setPrices(prices);

    setMonthPrices(
      (stock.month_prices || "")
        .trim()
        .split(",")
        .filter((item) => item != null)
        .map((item) => {
          return { price: parseInt(item * 100) / 100 };
        })
    );

    setMinutePrices(
      JSON.parse(stock.minute_prices_deltas || "[]").map((item, index) => {
        const price =
          index == 0 && prices[prices.length - 1]
            ? priceDiff(prices[prices.length - 1].price, stock.price)
            : item;
        return {
          price: price,
          fill: getXeroColor(price),
        };
      })
    );
  }, [props.stock]);

  function onSelectStock() {
    props.onSelectStock(props.stock);
  }

  let { stock } = props;

  return (
    <tr onClick={onSelectStock} key={props.stock.id}>
      <td className="px-2 py-1 whitespace-nowrap overflow-hidden max-h-12">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <div className="text-sm text-gray-500">{stock.name}</div>
              <span className={`inline-flex text-xs leading-5 font-semibold `}>
                {toDecimal(stock.ema_d_50)} {toDecimal(stock.ema_d_200)}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-1 whitespace-nowrap overflow-hidden max-h-12">
        <LineChart
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          width={100}
          height={35}
          data={monthPrices}
        >
          <ReferenceLine
            y={prices[0] ? prices[0].price : 0}
            stroke="#8dd1e1"
            strokeDasharray="3 3"
          />

          <YAxis domain={["dataMin", "dataMax"]} hide={true} />
          <Line
            dot={false}
            type="linear"
            name="name"
            dataKey="price"
            stroke="#8884d8"
          />
          <Tooltip
            formatter={(value, name, props) => {
              return [parseInt(value * 100) / 100];
            }}
            position={{ x: 100, y: -15 }}
            wrapperStyle={{ backgroundColor: "#333" }}
          />
        </LineChart>
      </td>

      <td className="px-6 py-1 whitespace-nowrap overflow-hidden max-h-12">
        <LineChart
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          width={100}
          height={35}
          data={prices}
        >
          <ReferenceLine
            y={prices[0] ? prices[0].price : 0}
            stroke="#8dd1e1"
            strokeDasharray="3 3"
          />

          <ReferenceLine x={12} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={24} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={36} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={48} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={60} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={72} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={84} stroke="#8dd1e1" strokeDasharray="3 3" />
          <ReferenceLine x={96} stroke="#8dd1e1" strokeDasharray="3 3" />

          <XAxis dataKey="index" hide={true} type="number" domain={[0, 70]} />
          <YAxis domain={["dataMin", "dataMax"]} hide={true} />
          <Line
            dot={false}
            type="linear"
            name="name"
            dataKey="price"
            stroke="#8884d8"
          />
          <Tooltip
            formatter={(value, name, props) => {
              return [
                parseInt(value * 10) / 10 +
                  " " +
                  priceDiff(value / props.payload.openPrice),
              ];
            }}
            position={{ x: 90, y: -15 }}
            wrapperStyle={{ backgroundColor: "#333" }}
          />
        </LineChart>
      </td>
      <td className="px-6  whitespace-nowrap overflow-y-hidden max-h-12">
        <BarChart
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          width={120}
          height={65}
          data={minutePrices}
        >
          <ReferenceLine y={0.4} stroke="#ddd" strokeDasharray="3 3" />
          <ReferenceLine y={-0.4} stroke="#ddd" strokeDasharray="3 3" />

          <YAxis domain={[-1, 1]} type="number" hide={true} />
          <Bar dot={false} dataKey="price" />
          <Tooltip
            formatter={(value, name, props) => {
              return [parseInt(value * 100) / 100 + "%"];
            }}
            label="name"
            position={{ x: 120, y: -15 }}
          />
        </BarChart>
      </td>

      <td className="px-6  whitespace-nowrap overflow-y-hidden max-h-12">
        <BarChart
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          width={150}
          height={65}
          data={[
            {
              name: "D",
              value: stock.price_delta_d,
              fill: getXeroColor(stock.price_delta_d),
            },
            {
              name: "2D",
              value: stock.price_delta_2d,
              fill: getXeroColor(stock.price_delta_2d),
            },
            {
              name: "3d",
              value: stock.price_delta_3d,
              fill: getXeroColor(stock.price_delta_3d),
            },
            {
              name: "4d",
              value: stock.price_delta_4d,
              fill: getXeroColor(stock.price_delta_4d),
            },
            {
              name: "4d",
              value: stock.price_delta_5d,
              fill: getXeroColor(stock.price_delta_5d),
            },
          ]}
        >
          <ReferenceLine y={0} stroke="grey" strokeDasharray="3 3" />

          <YAxis type="number" domain={[-4, 4]} hide={true} />
          <Bar dot={false} dataKey="value" />
          <Tooltip
            formatter={(value, name, props) => {
              return [parseInt(value * 10) / 10 + "%", props.payload.name];
            }}
            label="name"
            position={{ x: 160, y: -15 }}
            wrapperStyle={{ backgroundColor: "#333" }}
          />
        </BarChart>
      </td>

      <td className="px-6  overflow-y-hidden max-h-1">
        <BarChart
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          width={80}
          height={45}
          data={[
            {
              name: "D",
              value: stock.rsi_d,
              fill: getRsiColor(stock.rsi_d),
            },
            {
              name: "30M",
              value: stock.rsi_30,
              fill: getRsiColor(stock.rsi_30),
            },
            {
              name: "5M",
              value: stock.rsi_5,
              fill: getRsiColor(stock.rsi_5),
            },
          ].reverse()}
        >
          <YAxis domain={[10, 90]} hide={true} />

          <Tooltip
            formatter={(value, name, props) => {
              return [parseInt(value * 100) / 100, props.payload.name];
            }}
            label="name"
            position={{ x: 70, y: -15 }}
            wrapperStyle={{ backgroundColor: "#333" }}
          />
          <ReferenceLine y={30} stroke="#ffc658" />
          <ReferenceLine y={70} stroke="#ffc658" />

          <Bar dataKey="value" />
        </BarChart>
      </td>

      <td className="px-1 pt-1 whitespace-nowrap overflow-y-hidden max-h-12">
        <BarChart
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          width={80}
          height={45}
          data={[
            {
              name: "D",
              value: stock.macd_d_hist,
              fill: getXeroColor(stock.macd_d_hist),
            },
            {
              name: "30M",
              value: stock.macd_30_hist,
              fill: getXeroColor(stock.macd_30_hist),
            },
            {
              name: "5M",
              value: stock.macd_5_hist,
              fill: getXeroColor(stock.macd_5_hist),
            },
          ].reverse()}
        >
          <YAxis domain={[-0.2, 0.2]} hide={true} />

          <Tooltip
            formatter={(value, name, props) => {
              return [parseInt(value * 100) / 100, props.payload.name];
            }}
            label="name"
            position={{ x: 90, y: -15 }}
            wrapperStyle={{ backgroundColor: "#333" }}
          />
          <ReferenceLine y={0} stroke="#ffc658" />

          <Bar labelKey="name" dataKey="value" />
        </BarChart>
      </td>

      <td className="px-1 pt-1 whitespace-nowrap overflow-y-hidden max-h-12">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <div className="text-sm text-gray-500">
                ${numeral(stock.price).format("0,0.00")}
              </div>
              <span
                className={`inline-flex text-xs leading-5 font-semibold  ${
                  stock.price_delta_d > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stock.price_delta_d} %{" "}
              </span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function getRsiColor(value) {
  if (value >= 70) return "#F87171";
  else if (value <= 30) return "#10B981";
  else return "#D1D5DB";
}

function getXeroColor(value) {
  if (value <= 0) return "#F87171";
  return "#10B981";
}

function priceDiff(b, a) {
  let deltaD = 0;

  if (b == null) b = 0;
  if (a == null) a = 0;

  if (a < b) deltaD = ((b - a) / b) * -100;
  else deltaD = ((a - b) / b) * 100;
  return parseInt(deltaD * 100) / 100;
}

function toDecimal(value, decimal = 2) {
  if (decimal == 1) return parseInt(value * 10) / 10;
  if (decimal == 2) return parseInt(value * 100) / 100;
  else return parseInt(value);
}
