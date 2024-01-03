import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import GenericBar from "./templates/GenericBar";
import GenericPercentGrowth from "./templates/GenericPercentGrowth";
import TwoColumnView from "./templates/TwoColumnView";
import { convertToGrowthData, aggregateData } from "../../utils/Utils";

function WebTrafficChart({ user, companyName }) {
  const [trafficData, setTrafficData] = useState(null);

  const exportColumns =
    "target,display_date,visits,direct,referral,social,search,paid,mail,display_ad,users,mobile_users,desktop_users";

  useEffect(() => {
    console.log("companyName", companyName, user.id);
    updateTrafficData(user, companyName);
  }, [companyName]);

  const updateTrafficData = async (user, companyName) => {
    const response = await fetch(`/api/private/getWebTrafficData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        companiesUrl: companyName,
        exportColumns: exportColumns,
      }),
    });
    if (!response.ok) {
      console.log(response.status);
    }
    var data = await response.json();
    console.log(data);
    // transform data into {month: {key:value}}
    data = data.reduce((acc, item, i) => {
      if (!item || item.length === 0) {
        //no information for this month
        return acc;
      }
      const month = new Date(item[0]["display_date"]);

      acc[month] = {
        visits: parseInt(item[0]["visits"], 10),
        users: parseInt(item[0]["users"], 10),
      };
      return acc;
    }, {});

    setTrafficData(data);
  };

  function convertToChartData(data) {
    // input: {time_key: output_key}
    if (!data) {
      return;
    }
    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data).map((number) => (number / 1e6).toFixed(1)),
          borderWidth: 1,
        },
      ],
    };
  }

  const quarterTafficGraph = trafficData && (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(trafficData, "visits", "sum", "quarterYear")
      )}
      title={"Total Visits (millions)"}
    ></GenericBar>
  );
  const yearTrafficGraph = trafficData && (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(trafficData, "visits", "sum", "year")
      )}
      // title={"Total Visits (millions)"}
    ></GenericBar>
  );

  const quarterUserGraph = trafficData && (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(trafficData, "users", "mean", "quarterYear")
      )}
      title={"Web Users (millions)"}
    ></GenericBar>
  );

  const yearUserGraph = trafficData && (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(trafficData, "users", "mean", "year")
      )}
      // title={"Web Users (millions)"}
    ></GenericBar>
  );

  return (
    <div>
      <div className="h-64">
        <TwoColumnView
          title={"Website Traffic"}
          quarterGraph={quarterTafficGraph}
          yearGraph={yearTrafficGraph}
        ></TwoColumnView>
      </div>
      <div className="h-64">
        <TwoColumnView
          title={"Website MAU"}
          quarterGraph={quarterUserGraph}
          yearGraph={yearUserGraph}
        ></TwoColumnView>
      </div>
    </div>
  );
}

export default WebTrafficChart;
