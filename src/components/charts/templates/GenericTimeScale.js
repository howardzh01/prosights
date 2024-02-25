import React, { useContext, useState } from "react";
import Image from "next/image";
import {
  ArrowsPointingOutIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { TIMESCALE_TRANSITION_DIC } from "../../../constants";
import {
  ChartDataContext,
  SelectedChartContext,
} from "../../../pages/dashboard";

function GenericTimeScale({
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
  title,
  info = "",
  showModalButtons = false,
  showTimescaleButtons = false,
}) {
  const { selectedChart: chart, setSelectedChart } =
    useContext(SelectedChartContext);
  const { setChartData } = useContext(ChartDataContext);
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="flex justify-between">
      <div className="relative flex flex-row items-center">
        <div className="items-center gap-1 text-sm font-medium mr-2">
          {title}
        </div>
        {!!info && (
          <div
            className="group cursor-pointer"
            onMouseOver={() => setShowPopup(true)}
            onMouseOut={() => setShowPopup(false)}
          >
            <Image
              src="/assets/info.svg"
              alt="info"
              width={128}
              height={128}
              className="w-4"
            />
          </div>
        )}
        <div
          id="infoPopup"
          className="absolute bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 text-sm z-50"
          style={{
            display: showPopup ? "block" : "none",
          }}
        >
          {info}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {showTimescaleButtons && (
          <div className="mr-2 flex items-center">
            <button
              type="button"
              disabled={timescale === "quarterYear"}
              onClick={() => {
                setTimescale(TIMESCALE_TRANSITION_DIC[timescale][1]);
              }}
              className="mr-1"
            >
              <MinusCircleIcon
                className={`w-6 h-6 ${
                  timescale === "quarterYear"
                    ? "text-customGray-100"
                    : "text-customGray-400 hover:text-primaryHover active:text-primary"
                }`}
              />
            </button>
            <button
              type="button"
              disabled={timescale === "month"}
              onClick={() => {
                setTimescale(TIMESCALE_TRANSITION_DIC[timescale][0]);
              }}
            >
              <PlusCircleIcon
                className={`w-6 h-6 ${
                  timescale === "month"
                    ? "text-customGray-100"
                    : "text-customGray-400 hover:text-primaryHover active:text-primary"
                }`}
              />
            </button>
          </div>
        )}
        {/* don't show the expand button in the modal */}
        {!chart && showModalButtons && (
          <button
            type="button"
            onClick={() => {
              setSelectedChart(selectedChart);
              setChartData(rawChartData);
            }}
          >
            <Image
              src="/assets/expand.svg"
              alt="Company Logo"
              className="w-4 h-4 object-contain"
              width={128}
              height={128}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default GenericTimeScale;
