import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import GenericBar from "./templates/GenericBar";
import GenericPercentGrowth from "./templates/GenericPercentGrowth";
import TwoColumnView from "./templates/TwoColumnView";
import { convertToGrowthData, aggregateData } from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";

function WebTrafficChart({ user, companyUrl, country = "global" }) {
  const [trafficData, setTrafficData] = useState(null);

  const exportColumns =
    "target,rank,visits,desktop_visits,mobile_visits,users,desktop_users,mobile_users,desktop_hits,mobile_hits,direct,search_organic,search_paid,social_organic,social_paid,referral,mail,display_ad,search,social,paid,unknown_channel,time_on_site,desktop_time_on_site,mobile_time_on_site,pages_per_visit,desktop_pages_per_visit,mobile_pages_per_visit,bounce_rate,desktop_bounce_rate,mobile_bounce_rate,desktop_share,mobile_share,accuracy,display_date,country,device_type";
  // const channelLabelsDic = {
  //   direct: "Direct",
  //   mail: "Email",
  //   social: "Social",
  // };
  useEffect(() => {
    updateTrafficData(user, companyUrl);
  }, [companyUrl]);

  const updateTrafficData = async (user, companyUrl) => {
    const bodyObj = {
      userId: user.id,
      companiesUrl: companyUrl,
      exportColumns: exportColumns,
      country: country,
    };
    const response = await fetch(`/api/private/getWebTrafficData`, {
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
    data = data.reduce((acc, item, i) => {
      if (!item || item.length === 0) {
        //no information for this month
        return acc;
      }
      const month = new Date(item[0]["display_date"]);

      // acc[month] = {
      //   visits: parseInt(item[0]["visits"], 10),
      //   users: parseInt(item[0]["users"], 10),
      // };
      acc[month] = Object.keys(item[0]).reduce((obj, key) => {
        obj[key] = parseInt(item[0][key], 10);
        return obj;
      }, {});
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

  function convertToChannelChartData(trafficData, type = "traffic_by_channel") {
    let relevant_keys;
    if (type === "traffic_by_channel") {
      relevant_keys = [
        "direct",
        "mail",
        "social",
        "search",
        "referral",
        "display_ad",
      ];
    } else if (type === "traffic_by_device") {
      relevant_keys = ["mobile_visits", "desktop_visits"];
    } else if (type === "users_by_device") {
      relevant_keys = ["mobile_users", "desktop_users"];
    } else if (type === "traffic_by_organic_paid") {
      relevant_keys = [
        "search_organic",
        "social_organic",
        "search_paid",
        "social_paid",
      ];
    } else {
      relevant_keys = [
        "search_organic",
        "social_organic",
        "search_paid",
        "social_paid",
      ];
    }

    if (!trafficData) {
      return;
    }
    const aggData = relevant_keys.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData, key, "sum", "quarterYear");
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

  console.log(convertToChannelChartData(trafficData));
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
      <p className="text-2xl font-bold">Website Traffic by Channel</p>
      <div className="h-96">
        {trafficData && (
          <GenericStackedBar
            data={convertToChannelChartData(trafficData, "traffic_by_channel")}
            title={"% Share"}
          ></GenericStackedBar>
        )}
      </div>

      <p className="text-2xl font-bold">Website Traffic by Device</p>
      <div className="h-96">
        {trafficData && (
          <GenericStackedBar
            data={convertToChannelChartData(trafficData, "traffic_by_device")}
            title={"% Share"}
          ></GenericStackedBar>
        )}
      </div>
      <p className="text-2xl font-bold">Users by Device</p>
      <div className="h-96">
        {trafficData && (
          <GenericStackedBar
            data={convertToChannelChartData(trafficData, "users_by_device")}
            title={"% Share"}
          ></GenericStackedBar>
        )}
      </div>

      <p className="text-2xl font-bold">Website Traffic by Organic vs Paid </p>
      <div className="h-96">
        {trafficData && (
          <GenericStackedBar
            data={convertToChannelChartData(
              trafficData,
              "traffic_by_organic_paid"
            )}
            title={"% Share"}
          ></GenericStackedBar>
        )}
      </div>
    </div>
  );
}

export default WebTrafficChart;
