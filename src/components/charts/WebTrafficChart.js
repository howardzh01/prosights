import { useState, useEffect } from "react";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import ThreeColumnView from "./templates/ThreeColumnView";
import { aggregateData } from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";

function WebTrafficChart({ trafficData, selectedChart = null }) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [trafficTimescale, setTrafficTimescale] = useState("year");
  const [mauTimescale, setMauTimescale] = useState("year");
  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("year");
  const [trafficByDeviceTimescale, setTrafficByDeviceTimescale] =
    useState("year");
  const [usersByDeviceTimescale, setUsersByDeviceTimescale] = useState("year");
  const [trafficByOrganicVsPaidTimescale, setTrafficByOrganicVsPaidTimescale] =
    useState("year");

  if (!trafficData) return null;
  console.log(
    Object.keys(trafficData).map((key) => {
      let date = new Date(key);
      let year = date.getUTCFullYear().toString().substr(-2);
      let month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      return [`${month}-${year}`, trafficData[key]];
    })
  );
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

  function convertToChannelChartData(
    trafficData,
    type = "traffic_by_channel",
    timescale
  ) {
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

    const aggData = relevant_keys.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData, key, "sum", timescale);
      return acc;
    }, {});

    return {
      labels: Object.keys(aggData[relevant_keys[0]]),
      datasets: relevant_keys.map((key) => ({
        data: Object.values(aggData[key]).map((number) => number / 1e6),
        borderWidth: 1,
        label: key,
      })),
    };
  }

  const yearTrafficGraph = (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(trafficData, "visits", "sum", trafficTimescale)
      )}
      title={"Total Visits (millions)"}
      showDataLabels={trafficTimescale !== "month"}
      timescale={trafficTimescale}
      setTimescale={setTrafficTimescale}
      selectedChart={CHARTS.traffic}
      rawChartData={trafficData}
    ></GenericBar>
  );

  const yearUserGraph = (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(trafficData, "users", "mean", mauTimescale)
      )}
      title={"Web Users (millions)"}
      showDataLabels={mauTimescale !== "month"}
      timescale={mauTimescale}
      setTimescale={setMauTimescale}
      selectedChart={CHARTS.mau}
      // showTimescaleButtons={false}
      rawChartData={trafficData}
    ></GenericBar>
  );

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_channel",
        trafficByChannelTimescale
      )}
      title={"% Share"}
      showDataLabels={false}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      selectedChart={CHARTS.trafficByChannel}
      rawChartData={trafficData}
    ></GenericStackedBar>
  );

  const trafficByDevice = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_device",
        trafficByDeviceTimescale
      )}
      title={"% Share of Traffic by Device"}
      showDataLabels={trafficByDeviceTimescale === "year"}
      timescale={trafficByDeviceTimescale}
      setTimescale={setTrafficByDeviceTimescale}
      selectedChart={CHARTS.trafficByDevice}
      rawChartData={trafficData}
    ></GenericStackedBar>
  );

  const usersByDevice = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "users_by_device",
        usersByDeviceTimescale
      )}
      showDataLabels={usersByDeviceTimescale === "year"}
      title={"% Share of Users by Device"}
      timescale={usersByDeviceTimescale}
      setTimescale={setUsersByDeviceTimescale}
      selectedChart={CHARTS.usersByDevice}
      rawChartData={trafficData}
    ></GenericStackedBar>
  );

  const trafficByOrganicVsPaid = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_organic_paid",
        trafficByOrganicVsPaidTimescale
      )}
      title={"% Share of Organic Traffic"}
      showDataLabels={false}
      timescale={trafficByOrganicVsPaidTimescale}
      setTimescale={setTrafficByOrganicVsPaidTimescale}
      selectedChart={CHARTS.trafficByOrganicVsPaid}
      rawChartData={trafficData}
    ></GenericStackedBar>
  );

  switch (selectedChart) {
    case CHARTS.traffic:
      return yearTrafficGraph;
    case CHARTS.mau:
      return yearUserGraph;
    case CHARTS.trafficByChannel:
      return trafficByChannel;
    case CHARTS.trafficByDevice:
      return trafficByDevice;
    case CHARTS.usersByDevice:
      return usersByDevice;
    case CHARTS.trafficByOrganicVsPaid:
      return trafficByOrganicVsPaid;
    // if no selected chart, return all charts
    default:
      return (
        <div>
          <h2 id="WebsiteTraffic" className="text-2xl font-bold">
            Website Traffic
          </h2>
          <div className="h-fit">
            <ThreeColumnView
              titleId="traffic"
              title={""}
              graph1={yearTrafficGraph}
              graph2={yearUserGraph}
              graph3={trafficByChannel}
            ></ThreeColumnView>
          </div>
          <div className="h-64">
            <ThreeColumnView
              titleId="traffic"
              title={""}
              graph1={trafficByDevice}
              graph2={usersByDevice}
              graph3={trafficByOrganicVsPaid}
            ></ThreeColumnView>
          </div>
        </div>
      );
  }
}

export default WebTrafficChart;
