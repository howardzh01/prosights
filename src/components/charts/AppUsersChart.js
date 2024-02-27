import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import {
  convertToGrowthChartData,
  checkIfGrowthDataHasValuesGreaterThanOneMillion,
} from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS, INFO_HOVERS } from "../../constants";
import Image from "next/image";

function AppGrowthChart({
  appData,
  country,
  selectedChart = null,
  cutOffDate = new Date("2019"),
  type = "est_average_active_users", //other option is "est_download"
}) {
  if (!appData) return null;
  const relevantAppData = appData["app_performance"];
  const [appTimescale, setAppTrafficTimescale] = useState("quarterYear");
  const usersUnits = checkIfGrowthDataHasValuesGreaterThanOneMillion(
    aggregateData(relevantAppData, type, "mean", "quarterYear")
  )
    ? "M"
    : "K";
  let chartTitle;
  if (type === "est_average_active_users") {
    chartTitle = "App Users";
  } else if (type === "est_download") {
    chartTitle = "App Downloads";
  } else {
    return null;
  }
  const customAppGrowthGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(relevantAppData, type, "mean", appTimescale),
        chartTitle,
        cutOffDate,
        usersUnits
      )}
      title={`Monthly ${chartTitle} (${usersUnits})`}
      info={INFO_HOVERS.APP_USAGE.APP_USERS}
      showDataLabels={appTimescale !== "month"}
      timescale={appTimescale}
      setTimescale={setAppTrafficTimescale}
      // showTimescaleButtons={false}
      rawChartData={relevantAppData}
      showModalButtons={false}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
      location={country}
    />
  );
  const yearAppGrowthGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(relevantAppData, type, "mean", "year"),
        chartTitle,
        cutOffDate,
        usersUnits
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  switch (selectedChart) {
    case CHARTS.appActiveUsers:
      return (
        <TwoColumnView
          quarterGraph={customAppGrowthGraph}
          yearGraph={yearAppGrowthGraph}
        />
      );
    default:
      return (
        <div>
          <div className="h-fit mb-8">
            <TwoColumnView
              quarterGraph={customAppGrowthGraph}
              yearGraph={yearAppGrowthGraph}
            />
          </div>
        </div>
      );
  }
}

export default AppGrowthChart;
