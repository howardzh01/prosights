import { useState, useEffect } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { UN_M49_CONTINENTS } from "../../constants.js";
import { generateQuarters } from "../../utils/Utils";

function WebGeoTrafficChart({ user, companyUrl, startDate = "2019" }) {
  const [geoTrafficData, setGeoTrafficData] = useState(null);
  const [startDateState, setStartDateState] = useState(startDate);
  const displayedMonths = generateQuarters(startDateState);
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
    // transform data into {month: {key:value}}
    if (!data) {
      console.log("No data for geotraffic", companyUrl);
      return;
    }
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

    return {
      labels: displayedMonths,
      datasets: relevant_keys.map((key) => {
        console.log(key, aggData[key]);
        return {
          data: displayedMonths.map((quarter) =>
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
        {geoTrafficData && (
          <GenericStackedBar
            data={convertToGeoChartData(geoTrafficData, "traffic")}
            title={"% Share"}
            dataType={"dict"}
            showDataLabels={false}
          ></GenericStackedBar>
        )}
      </div>
    </div>
  );
}

export default WebGeoTrafficChart;
