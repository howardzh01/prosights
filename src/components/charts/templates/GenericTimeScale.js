import React, { useContext } from "react";
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
} from "../../../pages/newDashboard";

function GenericTimeScale({
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
  title,
  showModalButtons = false,
  showTimescaleButtons = false,
}) {
  // console.log(useContext(SelectedChartContext));
  const { selectedChart: chart, setSelectedChart } =
    useContext(SelectedChartContext);
  const { setChartData } = useContext(ChartDataContext);

  return (
    <div className="flex justify-between">
      <div className="items-center gap-1 text-md font-semibold">{title}</div>
      <div className="flex items-center gap-1">
        {showTimescaleButtons && (
          <>
            <button
              type="button"
              disabled={timescale === "year"}
              onClick={() =>
                setTimescale(TIMESCALE_TRANSITION_DIC[timescale][1])
              }
            >
              <MinusCircleIcon
                className={`w-6 h-6 ${
                  timescale === "year"
                    ? "text-customGray-200"
                    : "text-customGray-800"
                }`}
              />
            </button>
            <button
              type="button"
              disabled={timescale === "month"}
              onClick={() =>
                setTimescale(TIMESCALE_TRANSITION_DIC[timescale][0])
              }
            >
              <PlusCircleIcon
                className={`w-6 h-6 ${
                  timescale === "month"
                    ? "text-customGray-200"
                    : "text-customGray-800"
                }`}
              />
            </button>
          </>
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
            {/* <ArrowsPointingOutIcon className="w-6 h-6 text-customGray-800" /> */}
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
