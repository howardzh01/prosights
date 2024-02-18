import { useState } from "react";
import GenericBarAndTable from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import { convertToGrowthChartData } from "../../utils/ChartUtils";

function AppUsersSignal({ appData, country, cutOffDate = new Date("2019") }) {
  if (!appData) return null;

  const yearUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(
          appData["app_performance"],
          "est_average_active_users",
          "mean",
          "year"
        ),
        "App Users",
        cutOffDate
      )}
      title={"App Users (M)"}
      showTable={false}
      showTimescaleButtons={false}
      showModalButtons={true}
      scrollStart={"right"}
      location={country}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return yearUserGraph;
}

export default AppUsersSignal;
