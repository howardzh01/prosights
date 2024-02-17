import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToMarketShareData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficStackedBarPeers({
  multiCompanyTrafficData,
  country,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("quarterYear");
  if (!multiCompanyTrafficData) return null;

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToMarketShareData(
        multiCompanyTrafficData,
        trafficByChannelTimescale,
        cutOffDate
      )}
      title={"Total Visits Market Share (%)"}
      showDataLabels={trafficByChannelTimescale === "quarterYear"}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyTrafficData}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
      location={country}
    ></GenericStackedBar>
  );
  const yearTrafficByChannelGraph = (
    <GenericStackedBar
      data={convertToMarketShareData(
        multiCompanyTrafficData,
        "year",
        cutOffDate
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
      displayLegend={false}
    ></GenericStackedBar>
  );

  switch (selectedChart) {
    // if no selected chart, return all charts
    default:
      return (
        <div>
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Market Share vs. Peers
            </p>
            <div className="group inline-flex items-center hover:cursor-pointer hover:text-primary">
              <Image
                src="/assets/downloadInactive.svg"
                className="w-5 h-5 object-contain opacity-50 group-hover:hidden"
                width={256}
                height={256}
                alt="Download Icon"
              />
              <Image
                src="/assets/downloadActive.svg"
                className="w-5 h-5 object-contain hidden group-hover:block"
                width={256}
                height={256}
                alt="Download Icon"
              />
            </div>
          </div>
          <div className="h-fit mb-4">
            <TwoColumnView
              quarterGraph={trafficByChannel}
              yearGraph={yearTrafficByChannelGraph}
            />
          </div>
        </div>
      );
  }
}

export default WebTrafficStackedBarPeers;
