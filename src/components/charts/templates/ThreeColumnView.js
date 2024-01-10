function ThreeColumnView({ titleId, title, graph1, graph2, graph3 }) {
  return (
    <div className="">
      <h2 id={titleId} className="text-2xl font-bold">
        {title}
      </h2>
      <div className="flex justify-center space-x-8">
        <div className="w-1/3">{graph1}</div>
        <div className="w-1/3">{graph2}</div>
        <div className="w-1/3">{graph3}</div>
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
export default ThreeColumnView;
