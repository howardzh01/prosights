import GenericDoughnut from "./templates/GenericDoughnut";
import Image from "next/image";
import { convertToGeoDoughnutData } from "../../utils/ChartUtils";

function WebGeoTrafficDoughnut({ geoTrafficData, relevant_continents }) {
  if (!geoTrafficData) return null;

  return (
    <div>
      <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
        Geography
      </h2>
      <div className="flex flex-row items-center mb-8">
        <Image
          src="/assets/calendar.svg"
          alt="Company Logo"
          className="w-4 h-4 object-contain mr-1"
          width={128}
          height={128}
        />
        <p className="text-xs font-normal text-customGray-200">
          Last 12 Months
        </p>
      </div>
      <div className="px-2">
        <GenericDoughnut
          chartData={convertToGeoDoughnutData(geoTrafficData, "traffic")}
        />
      </div>
    </div>
  );
}

export default WebGeoTrafficDoughnut;
