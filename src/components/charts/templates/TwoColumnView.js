function TwoColumnView({ quarterGraph, yearGraph }) {
  return (
    <div className="flex flex-row w-full justify-between space-x-8">
      <div className="w-2/3 min-w-0 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50">
        {quarterGraph}
      </div>
      <div className="w-1/3 min-w-0 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50">
        {yearGraph}
      </div>
    </div>
  );
}
export default TwoColumnView;
