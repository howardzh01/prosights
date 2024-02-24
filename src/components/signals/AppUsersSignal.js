import { useState } from "react";
import GenericBarAndTable from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import {
  convertToGrowthChartData,
  checkIfGrowthDataHasValuesGreaterThanOneMillion,
} from "../../utils/ChartUtils";

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
      title={`App Users (${usersUnits})`}
      info={
        <span>
          <strong>Metric:</strong> Refers to the estimated number of average
          monthly unique app users for a given company. If a company has
          multiple apps, this metric only refers to the most popular app. An app
          user refers to an individual who has opened the app at least once
          during the month (excludes individuals with apps downloaded but not
          opened).
          <br />
          <br />
          <strong>Data Methodology:</strong> Data.ai sources its data from a
          combination of public app store data, anonymized 1st party data, and
          consumer panels to track over 1 million apps.
        </span>
      }
      showTable={false}
      showTimescaleButtons={false}
      showModalButtons={true}
      selectedChart={CHARTS.appActiveUsers}
      rawChartData={appData}
      scrollStart={"right"}
      location={country}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return yearUserGraph;
}

export default AppUsersSignal;
