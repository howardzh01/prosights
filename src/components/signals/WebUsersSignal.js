import { useState } from "react";
import GenericBarAndTable from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import {
  convertToGrowthChartData,
  checkIfGrowthDataHasValuesGreaterThanOneMillion,
} from "../../utils/ChartUtils";

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
      title={`Web Users (${usersUnits})`}
      info={
        <span>
          <strong>Metric:</strong> Refers to the estimated number of average
          monthly unique visitors for a given website (excludes app users). A
          visitor counts as any individual who visited the site at least once
          during the month.
          <br />
          <br />
          <strong>Data Methodology:</strong> Similar to how search engines like
          Google index the web, SEMRush employs an automated method of capturing
          and indexing public data from millions of website pages every month.
          The data is sourced from website crawlers and click-stream data from a
          large and diverse panel of tens of millions of users.
        </span>
      }
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
