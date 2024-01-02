import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import GenericBar from "./GenericBar";
import GenericPercentGrowth from "./GenericPercentGrowth";
import { dateToQuarters } from "../../utils/Utils";

function WebTrafficChart({ user, companyName }) {
  const [trafficData, setTrafficData] = useState(null);

  const exportColumns =
    "target,display_date,visits,direct,referral,social,search,paid,mail,display_ad,users,mobile_users,desktop_users";

  useEffect(() => {
    console.log("companyName", companyName, user.id);
    updateTrafficData(user, companyName);
  }, [companyName]);

  const aggregateData = (
    data,
    output_key,
    agg = "sum",
    timescale = "quarterYear"
  ) => {
    // inputs: expected data in monthly format {Date(): {'visits': x, 'users': x}}
    // outputs: {time_key: output_key}
    if (!data) {
      return;
    }
    const aggData = Object.entries(data).reduce((acc, [date, dic]) => {
      var timeInput;
      if (timescale === "quarterYear") {
        timeInput = dateToQuarters(date);
      } else if (timescale === "year") {
        timeInput = new Date(date).getFullYear();
      }
      acc[timeInput] = acc[timeInput] || { sum: 0, count: 0, last: 0 };
      acc[timeInput].sum += dic[output_key];
      acc[timeInput].count += 1;
      acc[timeInput].last = dic[output_key];

      return acc;
    }, {});

    return Object.entries(aggData).reduce(
      (acc, [timeInput, { sum, count, last }]) => {
        if (agg === "sum") {
          acc[timeInput] = sum;
        }

        if (agg === "mean") {
          acc[timeInput] = sum / count;
        }
        if (agg === "last") {
          acc[timeInput] = last;
        }
        return acc;
      },
      {}
    );
  };

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
  function convertToGrowthData(data) {
    if (!data) {
      return;
    }
    const values = Object.values(data);
    const percentGrowth = values.slice(1).map((value, index) => {
      const previousValue = values[index];
      const growth = ((value - previousValue) / previousValue) * 100;
      return growth.toFixed(0); // to keep 2 decimal places
    });
    return ["-", ...percentGrowth];
  }

  //   console.log(aggregateData(trafficData, "visits"));

  return (
    <div>
      <div className="h-64">
        <p className="text-2xl font-bold">Website Traffic</p>
        <div className="flex justify-center">
          <div className="w-3/4">
            {trafficData && (
              <GenericBar
                chartData={convertToChartData(
                  aggregateData(trafficData, "visits", "sum", "quarterYear")
                )}
                title={"Total Visits (millions)"}
              ></GenericBar>
            )}
          </div>
          <div className="w-1/4 ml-8">
            {trafficData && (
              <GenericBar
                chartData={convertToChartData(
                  aggregateData(trafficData, "visits", "sum", "year")
                )}
                // title={"Total Visits (millions)"}
              ></GenericBar>
            )}
          </div>
        </div>
        <div className="w-3/4">
          <GenericPercentGrowth
            data={convertToGrowthData(
              aggregateData(trafficData, "visits", "sum", "quarterYear")
            )}
          ></GenericPercentGrowth>
        </div>
      </div>
      <div className="h-48">
        <p className="text-2xl font-bold">Website MAU</p>
        {trafficData && (
          <GenericBar
            chartData={convertToChartData(
              aggregateData(trafficData, "users", "mean", "quarterYear")
            )}
            title={"Web Users (millions)"}
          ></GenericBar>
        )}
      </div>
    </div>
  );
}

export default WebTrafficChart;
