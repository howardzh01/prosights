import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import GenericBar from "./templates/GenericBar";
import GenericPercentGrowth from "./templates/GenericPercentGrowth";
import TwoColumnView from "./templates/TwoColumnView";
import { convertToGrowthData, aggregateData } from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { UN_M49_CONTINENTS } from "../../constants.js";

function WebGeoTrafficChart({ user, companyUrl }) {
  const [geoTrafficData, setGeoTrafficData] = useState(null);
  const geoType = "continent";

  const relevant_keys = [
    "North America",
    "South America",
    "Asia",
    "Europe",
    "Africa",
    "Australia",
  ];

  useEffect(() => {
    updateGeoTrafficData(user, companyUrl);
  }, [companyUrl]);

  const updateGeoTrafficData = async (user, companyUrl) => {
    const bodyObj = {
      userId: user.id,
      companyUrl: companyUrl,
      geoType: geoType,
    };
    const response = await fetch(`/api/private/getWebTrafficGeoData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    });
    if (!response.ok) {
      console.log(response.status);
    }
    var data = await response.json();
    console.log(data);
    // transform data into {month: {key:value}}
    data = data.reduce((acc, monthItem, i) => {
      if (!monthItem || monthItem.length === 0) {
        //no information for this month
        return acc;
      }
      const month = new Date(monthItem[0]["display_date"]);

      // acc[month] = {
      //   visits: parseInt(item[0]["visits"], 10),
      //   users: parseInt(item[0]["users"], 10),
      // };
      monthItem.forEach((continentItem) => {
        let continentName = getContinentName(continentItem);
        if (!continentName) {
          return;
        }
        if (!acc[continentName]) {
          acc[continentName] = {};
        }
        acc[continentName][month] = Object.keys(continentItem).reduce(
          (obj, key) => {
            obj[key] = parseInt(continentItem[key], 10);
            return obj;
          },
          {}
        );
      });

      return acc;
    }, {});

    setGeoTrafficData(data);
    console.log("geoTrafficData", data);
  };
  function getContinentName(continentItem) {
    // return continent name if exists and in relevant_continents else null
    if (!continentItem) {
      return;
    }
    let continent = UN_M49_CONTINENTS[parseInt(continentItem["geo"], 10)];
    if (!relevant_keys.includes(continent)) {
      return;
    }
    return continent;
  }
  function convertToGeoChartData(trafficData, outputKey = "traffic") {
    if (!trafficData) {
      return;
    }

    const aggData = relevant_keys.reduce((acc, key) => {
      acc[key] = aggregateData(
        trafficData[key],
        outputKey,
        "sum",
        "quarterYear"
      );
      return acc;
    }, {});
    console.log(aggData);
    return {
      labels: Object.keys(aggData[relevant_keys[0]]),
      datasets: relevant_keys.map((key) => ({
        data: Object.values(aggData[key]).map((number) => number / 1e6),
        borderWidth: 1,
        label: key,
      })),
    };
  }

  return (
    <div>
      <p className="text-2xl font-bold">Website Traffic by Geo</p>
      <div className="h-96">
        {geoTrafficData && (
          <GenericStackedBar
            data={convertToGeoChartData(geoTrafficData, "traffic")}
            title={"% Share"}
          ></GenericStackedBar>
        )}
      </div>
    </div>
  );
}

export default WebGeoTrafficChart;
