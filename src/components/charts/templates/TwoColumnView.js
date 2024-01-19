function TwoColumnView({ quarterGraph, yearGraph }) {
  return (
    <div className="flex flex-row w-full">
      <div className="w-3/4 min-w-0">{quarterGraph}</div>
      <div className="w-1/4 ml-8 min-w-0">{yearGraph}</div>
    </div>
  );
}
export default TwoColumnView;
