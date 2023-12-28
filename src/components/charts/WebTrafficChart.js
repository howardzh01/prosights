import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import GenericBar from "./GenericBar";
import { dateToQuarters } from "../../utils/Utils";

function WebTrafficChart({ user, companyName }) {
  const [chartData, setChartData] = useState(null);
  const [webUserData, setWebUserData] = useState(null);

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
    const quarterlyWebTraffic = data.reduce((acc, item, i) => {
      const quarterYear = dateToQuarters(new Date(item[0]["display_date"]));
      if (!acc[quarterYear]) {
        acc[quarterYear] = 0;
      }
      acc[quarterYear] += parseInt(item[0]["visits"], 10); // use sum of month's web traffic (TODO: rethink)
      return acc;
    }, {});
    setChartData({
      labels: Object.keys(quarterlyWebTraffic),
      datasets: [
        {
          data: Object.values(quarterlyWebTraffic).map((number) =>
            (number / 1e6).toFixed(1)
          ),
          borderWidth: 1,
        },
      ],
    });

    const quarterlyUsers = data.reduce((acc, item, i) => {
      const quarterYear = dateToQuarters(new Date(item[0]["display_date"]));
      //   if (!acc[quarterYear]) {
      //     acc[quarterYear] = 0;
      //   }
      acc[quarterYear] = parseInt(item[0]["users"], 10); // currently uses last months trafficTODO: rethink
      return acc;
    }, {});
    setWebUserData({
      labels: Object.keys(quarterlyUsers),
      datasets: [
        {
          data: Object.values(quarterlyUsers).map((number) =>
            (number / 1e6).toFixed(1)
          ),
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    // <div className="">
    //   {chartData && <Bar data={chartData} options={{}}></Bar>}
    // </div>
    <div>
      <div className="h-48">
        <p className="text-2xl font-bold">Website Traffic</p>
        {chartData && (
          <GenericBar
            chartData={chartData}
            title={"Total Visits (millions)"}
          ></GenericBar>
        )}
      </div>
      <div className="h-48">
        <p className="text-2xl font-bold">Website MAU</p>
        {chartData && (
          <GenericBar
            chartData={webUserData}
            title={"Web Users (millions)"}
          ></GenericBar>
        )}
      </div>
    </div>
  );
}

export default WebTrafficChart;
