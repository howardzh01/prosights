import ChartModal from "../../ChartModal";

function TwoColumnView({ titleId, title, quarterGraph, yearGraph }) {
  return (
    <div className="h-64">
      <h2 id={titleId} className="text-2xl font-bold">
        {title}
      </h2>
      <div className="flex justify-center">
        <div className="w-3/4">{quarterGraph}</div>
        <div className="w-1/4 ml-8">{yearGraph}</div>
      </div>
      {/* <div className="w-3/4">
        <GenericPercentGrowth
          data={convertToGrowthData(
            aggregateData(trafficData, "visits", "sum", "quarterYear")
          )}
        ></GenericPercentGrowth>
      </div> */}
    </div>
  );
}
export default TwoColumnView;
