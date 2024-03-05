import { useState } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBarAndTable from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { formatMoney } from "../../utils/Utils";
import { INFO_HOVERS } from "../../constants";
import { convertToChartData } from "../../utils/ChartUtils";

function HeadCountSignal({ headCountData, startCutoff = new Date("2019") }) {
  const [timescale, setTimescale] = useState("year");

  if (!headCountData) return null;

  const yearHeadCountGraph = (
    <GenericBarAndTable
      data={{
        chartData: convertToChartData(
          aggregateData(headCountData, "headcount", "last", timescale),
          startCutoff
        ),
      }}
      title={"Headcount"}
      info={INFO_HOVERS.SUMMARY.EMPLOYEE_HEADCOUNT}
      showDataLabels={timescale === "year"}
      timescale={timescale}
      setTimescale={setTimescale}
      showModalButtons={true}
      selectedChart={CHARTS.employeeCount}
      showTable={false}
      rawChartData={headCountData}
      showTimescaleButtons={false}
      formatChartLabelFunction={formatMoney}
      location={"Worldwide"}
    />
  );

  return yearHeadCountGraph;
}

export default HeadCountSignal;
