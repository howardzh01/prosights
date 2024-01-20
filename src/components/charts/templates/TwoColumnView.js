function TwoColumnView({ quarterGraph, yearGraph }) {
  return (
    <div className="flex flex-row w-full">
      <div className="w-3/4 min-w-0 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
        {quarterGraph}
      </div>
      <div className="w-1/4 ml-8 min-w-0 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
        {yearGraph}
      </div>
    </div>
  );
}
export default TwoColumnView;
