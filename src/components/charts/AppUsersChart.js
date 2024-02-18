import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import { convertToGrowthChartData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

function AppUsersChart({ appData, country, cutOffDate = new Date("2019") }) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  if (!appData) return null;
  const relevantAppData = appData["app_performance"];
  const [appTimescale, setAppTrafficTimescale] = useState("quarterYear");

  const customUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(
          relevantAppData,
          "est_average_active_users",
          "mean",
          appTimescale
        ),
        "App Users",
        cutOffDate
      )}
      title={"App Users (M)"}
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
  const yearUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(
          relevantAppData,
          "est_average_active_users",
          "mean",
          "year"
        ),
        "App Users",
        cutOffDate
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return (
    <div>
      <div className="flex flex-row items-center mb-3">
        <p className="text-lg font-semibold text-gray-800 mr-2">Growth</p>
      </div>
      <div className="h-fit mb-8">
        <TwoColumnView
          quarterGraph={customUserGraph}
          yearGraph={yearUserGraph}
        />
      </div>
    </div>
  );
}

export default AppUsersChart;
