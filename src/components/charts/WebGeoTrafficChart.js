import { useState, useEffect, useMemo } from "react";
import {
  aggregateData,
  convertMonthFormat,
  generateMonths,
  generateYears,
} from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { generateQuarters } from "../../utils/Utils";
import { CHARTS } from "../../constants";

function WebGeoTrafficChart({
  geoTrafficData,
  relevant_continents,
  startDate = "2019",
}) {
  const [startDateState, setStartDateState] = useState(startDate);
  const [timescale, setTimescale] = useState("year");

  const monthLabels = useMemo(
    () => generateMonths(startDateState),
    [startDateState]
  ).map((date) => convertMonthFormat(date));

  const quarterLabels = useMemo(
    () => generateQuarters(startDateState),
    [startDateState]
  );

  const yearLabels = useMemo(
    () => generateYears(startDateState),
    [startDateState]
  );

  let displayedLabels;
  switch (timescale) {
    case "month":
      displayedLabels = monthLabels;
      break;
    case "quarterYear":
      displayedLabels = quarterLabels;
      break;
    case "year":
      displayedLabels = yearLabels;
      break;
    default:
      displayedLabels = yearLabels;
  }

  if (!geoTrafficData) return null;

  function convertToGeoChartData(trafficData, outputKey = "traffic") {
    const aggData = relevant_continents.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData[key], outputKey, "sum", timescale);
      return acc;
    }, {});

    return {
      labels: displayedLabels,
      datasets: relevant_continents.map((key) => {
        return {
          data: displayedLabels.map((time) =>
            aggData[key] ? aggData[key][time] / 1e6 : 0
          ),
          borderWidth: 1,
          label: key,
        };
      }),
    };
  }
  return (
    <div>
      <h2 id="trafficByGeo" className="text-2xl font-bold">
        Website Traffic by Geo
      </h2>
      <div className="h-96">
        <GenericStackedBar
          data={convertToGeoChartData(geoTrafficData, "traffic")}
          title={"% Share"}
          showDataLabels={false}
          timescale={timescale}
          setTimescale={setTimescale}
          selectedChart={CHARTS.trafficByGeo}
          rawChartData={geoTrafficData}
        ></GenericStackedBar>
      </div>
    </div>
  );
}

export default WebGeoTrafficChart;
