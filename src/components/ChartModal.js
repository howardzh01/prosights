import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import HeadCountChart from "./charts/HeadCountChart";
import { CHARTS } from "../constants";
import WebGeoTrafficChart from "./charts/WebGeoTrafficChart";
import WebTrafficChart from "./charts/WebTrafficChart";
import AppUsersChart from "./charts/AppUsersChart";
import WebTrafficByChannelChart from "./charts/WebTrafficByChannelChart";
import AppLoyaltyPeersModalCharts from "./charts/AppLoyaltyPeersModalCharts";

export default function ChartModal({
  open,
  setOpen,
  selectedChart,
  chartData,
  country,
}) {
  let chart;

  switch (selectedChart) {
    case CHARTS.employeeCount:
      chart = <HeadCountChart headCountData={chartData} />;
      break;

    case CHARTS.trafficByGeo:
      chart = <WebGeoTrafficChart geoTrafficData={chartData} />;
      break;

    case CHARTS.trafficActiveUsers:
      chart = (
        <WebTrafficChart
          trafficData={chartData}
          selectedChart={CHARTS.trafficActiveUsers}
          country={country}
        />
      );
      break;

    case CHARTS.trafficByChannel:
    case CHARTS.trafficByDevice:
    case CHARTS.trafficByOrganicVsPaid:
      chart = (
        <WebTrafficByChannelChart
          trafficData={chartData}
          country={country}
          selectedChart={selectedChart}
        />
      );
      break;

    case CHARTS.appActiveUsers:
      chart = (
        <AppUsersChart
          appData={chartData}
          country={country}
          selectedChart={CHARTS.appActiveUsers}
        />
      );
      break;

    case CHARTS.appLTMRetention:
    case CHARTS.appLTMActiveDays:
    case CHARTS.appLTMTimePerUser:
    case CHARTS.appLTMTimePerSession:
      chart = (
        <AppLoyaltyPeersModalCharts
          multiCompanyAppData={chartData}
          selectedChart={selectedChart}
          country={country}
        />
      );
      break;
    default:
      return null;
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Dialog.Title></Dialog.Title>
        {/* Need to include Dialog.Title to prevent modal closing on first open click. See https://github.com/tailwindlabs/headlessui/issues/2535#issuecomment-1672667145*/}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg px-8 bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[80%]">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="py-60">{chart}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
