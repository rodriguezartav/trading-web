import useSWR from "swr";
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

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const tabs = [
  { name: "Applied", href: "#", current: false },
  { name: "Phone Screening", href: "#", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function useStock(stock, resolution) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_WS_API_URL}/stocks/${stock}/${resolution}`,
    fetcher
  );

  return {
    bars: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function StockInfo(props) {
  const { bars, isLoading, isError } = useStock(props.stock.name, "5");

  console.log(bars);

  return (
    <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {props.stock.name}
        </h3>
        <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue={"a"}
          >
            <option key="grapg">Graph</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            <a
              className={classNames(
                "border-indigo-500 text-indigo-600",
                // "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
              )}
            >
              Graph
              <div className="relative w-full">
                <LineChart
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  width={500}
                  height={400}
                  data={
                    bars
                      ? bars.c.map((item, index) => {
                          return {
                            price: item,
                            time: moment.unix(bars.t[index]).toDate(),
                          };
                        })
                      : []
                  }
                >
                  <YAxis domain={["dataMin", "dataMax"]} hide={true} />

                  <XAxis dataKey="time" scale="time" />

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
                        parseInt(value * 100) / 100,
                        moment.unix(props.payload.time).format("HH:mm"),
                      ];
                    }}
                    wrapperStyle={{ backgroundColor: "#333" }}
                  />
                </LineChart>
              </div>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
