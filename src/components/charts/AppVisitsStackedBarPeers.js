import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToAppUsageMarketShareVsPeersData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

function AppVisitsStackedBarPeers({
  multiCompanyAppData,
  country,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  if (!multiCompanyAppData) return null;
  const multiCompanyAppPerformance = Object.keys(multiCompanyAppData).reduce(
    (acc, companyName) => {
      if (multiCompanyAppData[companyName]) {
        acc[companyName] = multiCompanyAppData[companyName]["app_performance"];
      }
      return acc;
    },
    {}
  );
  if (
    !multiCompanyAppPerformance ||
    Object.keys(multiCompanyAppPerformance).length === 0
  )
    return null;
  const [appByChannelTimescale, setAppByChannelTimescale] =
    useState("quarterYear");

  const appByChannel = (
    <GenericStackedBar
      data={convertToAppUsageMarketShareVsPeersData(
        multiCompanyAppPerformance,
        appByChannelTimescale
      )}
      title={"Average App MAU Market Share (%)"}
      showDataLabels={appByChannelTimescale === "quarterYear"}
      timescale={appByChannelTimescale}
      setTimescale={setAppByChannelTimescale}
      selectedChart={CHARTS.appByChannel}
      rawChartData={multiCompanyAppPerformance}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
      location={country}
    ></GenericStackedBar>
  );
  const yearAppByChannelGraph = (
    <GenericStackedBar
      data={convertToAppUsageMarketShareVsPeersData(
        multiCompanyAppPerformance,
        "year"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
      displayLegend={false}
    ></GenericStackedBar>
  );

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
          />
          <Image
            src="/assets/downloadActive.svg"
            className="w-5 h-5 object-contain hidden group-hover:block"
            width={256}
            height={256}
          />
        </div>
      </div>
      <div className="h-fit mb-4">
        <TwoColumnView
          quarterGraph={appByChannel}
          yearGraph={yearAppByChannelGraph}
        />
      </div>
    </div>
  );
}

export default AppVisitsStackedBarPeers;
