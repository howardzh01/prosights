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

function AppUsersSignal({ appData, country, cutOffDate = new Date("2019") }) {
  if (!appData) return null;
  const usersUnits = checkIfGrowthDataHasValuesGreaterThanOneMillion(
    aggregateData(
      appData["app_performance"],
      "est_average_active_users",
      "mean",
      "quarterYear"
    )
  )
    ? "M"
    : "K";

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
        cutOffDate,
        usersUnits
      )}
      title={`Monthly App Users (${usersUnits})`}
      info={INFO_HOVERS.SUMMARY.APP_USERS}
      showTable={false}
      showTimescaleButtons={false}
      showModalButtons={true}
      selectedChart={CHARTS.appActiveUsers}
      rawChartData={appData}
      scrollStart={"right"}
      location={country}
      //   formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return yearUserGraph;
}

export default AppUsersSignal;
