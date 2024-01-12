import { useState, useEffect } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { generateQuarters } from "../../utils/Utils";

function WebGeoTrafficChart({
  geoTrafficData,
  relevant_continents,
  startDate = "2019",
}) {
  const [startDateState, setStartDateState] = useState(startDate);
  const displayedQuarters = generateQuarters(startDateState);

  if (!geoTrafficData) return null;

  function convertToGeoChartData(trafficData, outputKey = "traffic") {
    const aggData = relevant_continents.reduce((acc, key) => {
      acc[key] = aggregateData(
        trafficData[key],
        outputKey,
        "sum",
        "quarterYear"
      );
      return acc;
    }, {});

    return {
      labels: displayedQuarters,
      datasets: relevant_continents.map((key) => {
        return {
          data: displayedQuarters.map((quarter) =>
            aggData[key] ? aggData[key][quarter] / 1e6 : 0
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
          dataType={"dict"}
          showDataLabels={false}
        ></GenericStackedBar>
      </div>
    </div>
  );
}

export default WebGeoTrafficChart;
