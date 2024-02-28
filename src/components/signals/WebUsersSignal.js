import { useState } from "react";
import GenericBarAndTable from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import {
  convertToGrowthChartData,
  checkIfGrowthDataHasValuesGreaterThanOneMillion,
} from "../../utils/ChartUtils";
import { INFO_HOVERS } from "../../constants";

function WebUsersSignal({
  webTrafficData,
  country,
  cutOffDate = new Date("2019"),
}) {
  if (!webTrafficData) return null;
  const usersUnits = checkIfGrowthDataHasValuesGreaterThanOneMillion(
    aggregateData(webTrafficData, "users", "mean", "quarterYear")
  )
    ? "M"
    : "K";

  const yearUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(webTrafficData, "users", "mean", "year"),
        "Users",
        cutOffDate,
        usersUnits
      )}
      title={`Monthly Web Visitors (${usersUnits})`}
      info={INFO_HOVERS.SUMMARY.WEB_USERS}
      showTable={false}
      showTimescaleButtons={false}
      showModalButtons={true}
      selectedChart={CHARTS.trafficActiveUsers}
      rawChartData={webTrafficData}
      scrollStart={"right"}
      location={country}
      //   formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return yearUserGraph;
}

export default WebUsersSignal;
