function TwoColumnView({ quarterGraph, yearGraph }) {
  return (
    <div className="">
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
