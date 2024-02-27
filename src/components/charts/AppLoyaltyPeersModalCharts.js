import { useState, useEffect } from "react";
import { CHARTS, CHARTJS_COLORS } from "../../constants";
import Image from "next/image";
import {
  convertToAppUsageLoyaltyVsPeersData,
  convertToAppLoyaltyPeersLineData,
} from "../../utils/ChartUtils";
import { roundPeNumbers } from "../../utils/Utils";
import GenericLine from "./templates/GenericLine";
import TwoColumnView from "./templates/TwoColumnView";

function AppLoyaltyPeersModalCharts({
  multiCompanyAppData,
  country,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // trafficData is of the form {company1: data, company2: data, ...}
  if (!multiCompanyAppData) return null;
  const [appLoyaltyTimeScale, setAppLoyaltyTimescale] = useState("quarterYear");
  let formatTableDataFunction, tickType;
  switch (selectedChart) {
    case CHARTS.appLTMRetentionM3:
      formatTableDataFunction = (value) =>
        value !== null ? `${value}%` : "--";
      tickType = "percentage";
      break;
    case CHARTS.appLTMRetentionM6:
      formatTableDataFunction = (value) =>
        value !== null ? `${value}%` : "--";
      tickType = "percentage";
      break;
    case CHARTS.appLTMTimePerUser:
      formatTableDataFunction = (value) => (value !== null ? `${value}` : "--");
      tickType = "min";
      break;
    case CHARTS.appLTMTimePerSession:
      formatTableDataFunction = (value) => (value !== null ? `${value}` : "--");
      tickType = "min";
      break;
    // if no selected chart, return by channel
    default:
      return;
  }

  const appLoyaltyPeersLineChart = (
    <GenericLine
      data={convertToAppLoyaltyPeersLineData(
        multiCompanyAppData,
        appLoyaltyTimeScale,
        cutOffDate,
        selectedChart,
        false
      )}
      title={selectedChart}
      timescale={appLoyaltyTimeScale}
      setTimescale={setAppLoyaltyTimescale}
      location={country}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyAppData}
      formatTableDataFunction={formatTableDataFunction}
      showDataLabels={true}
      showTimescaleButtons={true}
      showModalButtons={false}
      selectedChart={selectedChart}
      height={"h-full"}
      tickType={tickType}
      beginAtZero={true}
    />
  );
  const yearAppLoyaltyPeersLineChart = (
    <GenericLine
      data={convertToAppLoyaltyPeersLineData(
        multiCompanyAppData,
        "year",
        cutOffDate,
        selectedChart,
        false
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={formatTableDataFunction}
      tickType={tickType}
      beginAtZero={true}
    />
  );
  return (
    <div>
      <TwoColumnView
        quarterGraph={appLoyaltyPeersLineChart}
        yearGraph={yearAppLoyaltyPeersLineChart}
      ></TwoColumnView>
    </div>
  );
}

export default AppLoyaltyPeersModalCharts;
