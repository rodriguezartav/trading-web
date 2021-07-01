/* This example requires Tailwind CSS v2.0+ */
import { DotsVerticalIcon } from "@heroicons/react/solid";
import moment from "moment";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ClockIcon,
  HomeIcon,
  MenuAlt1Icon,
  ViewListIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  ChevronRightIcon,
  DuplicateIcon,
  PencilAltIcon,
  SearchIcon,
  SelectorIcon,
  TrashIcon,
  UserAddIcon,
} from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example(props) {
  const stockMap = {};
  props.stocks.forEach(function (stock) {
    stockMap[stock.id] = stock;
  });

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Orders
      </h2>

      <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-1 lg:grid-cols-1">
        {props.orders.map((order) => (
          <li
            key={order.id}
            className="relative col-span-1 flex shadow-sm rounded-md"
          >
            <div
              className={classNames(
                order.type == "SHORT" ? "bg-pink-600" : "bg-green-500",
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
              )}
            >
              {stockMap[order.stock_id].name}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a
                  href={order.href}
                  className="text-gray-900 font-medium hover:text-gray-600"
                >
                  {order.description}
                </a>
                <p className="text-gray-500">
                  ${order.price_limit} <small>{order.timeAgo}s</small>{" "}
                </p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <Menu as="div" className="flex-shrink-0 pr-2">
                  {({ open }) => (
                    <>
                      <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <span className="sr-only">Open options</span>
                        <DotsVerticalIcon
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                        >
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  Execute
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  Delete
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  Share
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
