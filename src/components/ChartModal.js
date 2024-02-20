import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import HeadCountChart from "./charts/HeadCountChart";
import { CHARTS, RELEVANT_CONTINENTS } from "../constants";
import WebGeoTrafficDoughnut from "./charts/WebGeoTrafficDoughnut";
import WebTrafficChart from "./charts/WebTrafficChart";
import AppUsersChart from "./charts/AppUsersChart";
import WebTrafficByChannelChart from "./charts/WebTrafficByChannelChart";

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
      chart = (
        <WebGeoTrafficDoughnut
          geoTrafficData={chartData}
          relevant_continents={RELEVANT_CONTINENTS}
        />
      );
      break;
    // case CHARTS.traffic:
    //   chart = (
    //     <WebTrafficChart
    //       trafficData={chartData}
    //       selectedChart={CHARTS.traffic}
    //       country={country}
    //     />
    //   );
    //   break;
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
      chart = (
        <WebTrafficByChannelChart
          trafficData={chartData}
          country={country}
          selectedChart={CHARTS.trafficByChannel}
        />
      );
      break;
    case CHARTS.trafficByDevice:
      chart = (
        <WebTrafficByChannelChart
          trafficData={chartData}
          country={country}
          selectedChart={CHARTS.trafficByDevice}
        />
      );
      break;
    // case CHARTS.usersByDevice:
    //   chart = (
    //     <WebTrafficChart
    //       trafficData={chartData}
    //       selectedChart={CHARTS.usersByDevice}
    //     />
    //   );
    //   break;
    case CHARTS.trafficByOrganicVsPaid:
      chart = (
        <WebTrafficByChannelChart
          trafficData={chartData}
          country={country}
          selectedChart={CHARTS.trafficByOrganicVsPaid}
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[80%] sm:p-6 sm:pt-16">
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
                <div className="">{chart}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
