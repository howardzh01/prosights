function TwoColumnView({ quarterGraph, yearGraph }) {
  return (
    <div className="flex flex-row w-full">
      <div className="w-2/3 min-w-0 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
        {quarterGraph}
      </div>
      <div className="w-1/3 ml-6 min-w-0 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
        {yearGraph}
      </div>
    </div>
  );
}
export default TwoColumnView;
