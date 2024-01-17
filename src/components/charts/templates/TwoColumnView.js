function TwoColumnView({ quarterGraph, yearGraph }) {
  return (
    <div className="flex flex-row w-full">
      <div className="w-3/4">{quarterGraph}</div>
      <div className="w-1/4 ml-8">{yearGraph}</div>
    </div>
  );
}
export default TwoColumnView;
