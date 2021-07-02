import React from "react";

import StockItem from "./stockListItem";

export default function StockList(props) {
  function onSelectStock(stock) {
    props.onSelectStock(stock);
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
                    5M Changes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Day Changes
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
                  return (
                    <StockItem stock={stock} onSelectStock={onSelectStock} />
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
