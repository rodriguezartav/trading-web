import { LineChart, Line, Tooltip, YAxis, ReferenceLine } from "recharts";
import moment from "moment";
import numeral from "numeral";

export default function StockList(props) {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="-my-2  sm:-mx-6 lg:-mx-8">
        <div className="py-3 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow  border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full mb-10 divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                    Today
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    5M
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    D
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

                  if (stock.price && prices.length > 1)
                    prices.push({ price: stock.price });

                  return (
                    <tr key={stock.id}>
                      <td className="px-2 py-1 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-1 whitespace-nowrap">
                        <LineChart width={100} height={35} data={prices}>
                          <ReferenceLine
                            y={prices[0].price}
                            stroke="red"
                            strokeDasharray="3 3"
                          />

                          <YAxis domain={["dataMin", "dataMax"]} hide={true} />
                          <Line
                            dot={false}
                            type="linear"
                            dataKey="price"
                            stroke="#8884d8"
                          />
                          <Tooltip />
                        </LineChart>
                      </td>

                      <td className="px-1 pt-1 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <div className="text-sm text-gray-500">
                                <span
                                  className={`${
                                    stock.macd_5_hist > 0
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {parseInt(stock.macd_5_hist * 100) / 100}
                                </span>{" "}
                                @ {parseInt(stock.rsi_5)}
                              </div>
                              <span
                                className={`inline-flex text-xs leading-5 font-semibold text-gray-500`}
                              >
                                {moment(stock.macd_5_last_cross).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-1 pt-1 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <div className="text-sm text-gray-500">
                                {parseInt(stock.macd_d_hist * 100) / 100}
                              </div>
                              <span
                                className={`inline-flex text-xs leading-5 font-semibold  ${
                                  stock.macd_d_hist > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {moment(stock.macd_d_last_cross).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-1 pt-1 whitespace-nowrap">
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
