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

export default function StockList(props) {
  function onSelectStock(stock) {
    return () => {
      props.onSelectStock(stock);
    };
  }

  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="-my-2  sm:-mx-6 lg:-mx-8">
        <div className="py-3 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow  border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full mb-10 divide-y divide-gray-200">
              <thead className="bg-gray-50 h-">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Month
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Today
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    5 Minutes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prices (1,5,30,90,D,2D)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    RSI(5,30,D)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    MACD(5,30,D)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {props.stocks.map((stock) => {
                  let prices = stock.today_prices
                    .trim()
                    .split(",")
                    .filter((item) => item != null)
                    .map((item) => {
                      return { price: parseInt(item * 100) / 100 };
                    });

                  let month_prices = (stock.month_prices || "")
                    .trim()
                    .split(",")
                    .filter((item) => item != null)
                    .map((item) => {
                      return { price: parseInt(item * 100) / 100 };
                    });

                  let minutePrices = JSON.parse(
                    stock.minute_prices_deltas || "[]"
                  ).map((item, index) => {
                    const price =
                      index == 0
                        ? priceDiff(
                            prices[prices.length - 1].price,
                            stock.price
                          )
                        : item;
                    return {
                      price: price,
                      fill: price >= 0 ? "#a4de6c" : "#ffc658",
                    };
                  });

                  if (stock.price && prices.length > 1)
                    prices.push({ price: stock.price });

                  return (
                    <tr onClick={onSelectStock(stock)} key={stock.id}>
                      <td className="px-2 py-1 whitespace-nowrap overflow-hidden max-h-12">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <div className="text-sm text-gray-500">
                                {stock.name}
                              </div>
                              <span
                                className={`inline-flex text-xs leading-5 font-semibold  ${
                                  stock.price_delta_d > 0
                                    ? "text-green-500"
                                    : "text-#ffc658-500"
                                }`}
                              >
                                {stock.amount} {stock.average_price}
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
                          data={month_prices}
                        >
                          <ReferenceLine
                            y={prices[0].price}
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
                            y={prices[0].price}
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
                              return [parseInt(value * 10) / 10];
                            }}
                            position={{ x: 110, y: -15 }}
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
                          <ReferenceLine
                            y={0}
                            stroke="grey"
                            strokeDasharray="3 3"
                          />

                          <YAxis domain={[-1, 1]} type="number" hide={true} />
                          <Bar dot={false} dataKey="price" />
                          <Tooltip
                            formatter={(value, name, props) => {
                              return [parseInt(value * 10) / 10 + "%"];
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
                              name: "5M",
                              value: stock.price_delta_5,
                              fill:
                                stock.price_delta_5 > 0 ? "#a4de6c" : "#ffc658",
                            },

                            {
                              name: "30M",
                              value: stock.price_delta_30,
                              fill:
                                stock.price_delta_30 > 0
                                  ? "#a4de6c"
                                  : "#ffc658",
                            },
                            {
                              name: "90M",
                              value: stock.price_delta_90,
                              fill:
                                stock.price_delta_90 > 0
                                  ? "#a4de6c"
                                  : "#ffc658",
                            },
                            {
                              name: "D",
                              value: stock.price_delta_d,
                              fill:
                                stock.price_delta_d > 0 ? "#a4de6c" : "#ffc658",
                            },
                            {
                              name: "2D",
                              value: stock.price_delta_2d,
                              fill:
                                stock.price_delta_2d > 0
                                  ? "#a4de6c"
                                  : "#ffc658",
                            },
                          ]}
                        >
                          <ReferenceLine
                            y={0}
                            stroke="grey"
                            strokeDasharray="3 3"
                          />

                          <YAxis type="number" domain={[-4, 4]} hide={true} />
                          <Bar dot={false} dataKey="value" />
                          <Tooltip
                            formatter={(value, name, props) => {
                              return [
                                parseInt(value * 10) / 10 + "%",
                                props.payload.name,
                              ];
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
                              return [
                                parseInt(value * 100) / 100,
                                props.payload.name,
                              ];
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
                              return [
                                parseInt(value * 100) / 100,
                                props.payload.name,
                              ];
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
                                  stock.price_delta_d > 0
                                    ? "text-green-500"
                                    : "text-red-500"
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRsiColor(value) {
  if (value >= 70) return "#ffc658";
  else if (value <= 30) return "#a4de6c";
  else return "#8884d8";
}

function getXeroColor(value) {
  if (value <= 0) return "#ffc658";
  return "#a4de6c";
}

function priceDiff(b, a) {
  let deltaD = 0;

  if (b == null) b = 0;
  if (a == null) a = 0;

  if (a < b) deltaD = ((b - a) / b) * -100;
  else deltaD = ((a - b) / b) * 100;
  return parseInt(deltaD * 100) / 100;
}
