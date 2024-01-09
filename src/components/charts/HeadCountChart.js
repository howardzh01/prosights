import { useState, useEffect } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";

function HeadCountChart({ user, companyName }) {
  const [headCountData, setHeadCountData] = useState(null);

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
      setHeadCountData(null);
    }
    var data = await response.json();
    data = data.reverse();
    // transform to  {month: {key:value}}
    const formattedData = data.reduce((acc, item, i) => {
      const month = new Date(item.created);
      acc[month] = {
        headcount: item.headcount,
      };
      return acc;
    }, {});

    setHeadCountData(formattedData);
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
          // label: "Total Employee (#)",
          data: Object.values(data),
          // backgroundColor: "rgba(75, 192, 192, 0.2)",
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }

  const quarterHeadCountGraph = headCountData && (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(headCountData, "headcount", "last", "quarterYear")
      )}
      title={"Total Employee (#)"}
    />
  );
  const yearHeadCountGraph = headCountData && (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(headCountData, "headcount", "last", "year")
      )}
    />
  );

  return (
    <div className="h-48">
      <TwoColumnView
        titleId="employeeCount"
        title={"Employee Count"}
        quarterGraph={quarterHeadCountGraph}
        yearGraph={yearHeadCountGraph}
      ></TwoColumnView>
    </div>
  );
}

export default HeadCountChart;
