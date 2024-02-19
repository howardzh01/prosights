import { useState } from "react";
import GenericBarAndTable from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import { convertToGrowthChartData } from "../../utils/ChartUtils";

function WebUsersSignal({
  webTrafficData,
  country,
  cutOffDate = new Date("2019"),
}) {
  if (!webTrafficData) return null;

  const yearUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(webTrafficData, "users", "mean", "year"),
        "Users",
        cutOffDate
      )}
      title={"Web Users (M)"}
      showTable={false}
      showTimescaleButtons={false}
      showModalButtons={true}
      selectedChart={CHARTS.trafficActiveUsers}
      rawChartData={webTrafficData}
      scrollStart={"right"}
      location={country}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return yearUserGraph;
}

export default WebUsersSignal;
