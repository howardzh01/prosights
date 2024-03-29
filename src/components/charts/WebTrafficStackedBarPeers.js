import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToMarketShareData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS, INFO_HOVERS } from "../../constants";
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
      info={INFO_HOVERS.TRAFFIC.MARKET_SHARE_VS_PEERS}
      showDataLabels={trafficByChannelTimescale === "quarterYear"}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyTrafficData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
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
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
      displayLegend={false}
    ></GenericStackedBar>
  );

  switch (selectedChart) {
    // if no selected chart, return all charts
    default:
      return (
        <div>
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
