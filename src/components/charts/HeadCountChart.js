import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { dateToQuarters } from "../../utils/Utils";
import GenericBar from "./GenericBar";

function HeadCountChart({ user, companyName }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log("companyName", companyName, user.id);
    updateHeadCount(user, companyName);
  }, [companyName]);

  const updateHeadCount = async (user, companyName) => {
    const response = await fetch(`/api/private/getHeadCount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        companyName: companyName,
      }),
    });
    if (!response.ok) {
      console.log(response.status);
      setChartData(null);
    }
    var data = await response.json();
    data = data.reverse();
    const formattedData = {
      created: data.map((item) => new Date(item.created)),
      headcount: data.map((item) => item.headcount),
    };
    const quarterlyHeadcounts = formattedData.created.reduce((acc, date, i) => {
      const quarter = dateToQuarters(date);
      acc[quarter] = formattedData.headcount[i]; // use most recent month's headcount. Ex: 2021Q1 = 2021-03-01 if possible otherwise 2021-02-01 ...
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(quarterlyHeadcounts),
      datasets: [
        {
          // label: "Total Employee (#)",
          data: Object.values(quarterlyHeadcounts), // assuming headCountData.headcount is an array of headcounts
          // backgroundColor: "rgba(75, 192, 192, 0.2)",
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="h-48">
      <p className="text-2xl font-bold">Employee Count</p>
      {chartData && (
        <GenericBar chartData={chartData} title={"Total Employee (#)"} />
      )}
    </div>
  );
}

export default HeadCountChart;
