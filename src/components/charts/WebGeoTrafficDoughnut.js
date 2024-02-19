import GenericDoughnut from "./templates/GenericDoughnut";
import Image from "next/image";
import { convertToGeoDoughnutData } from "../../utils/ChartUtils";

function WebGeoTrafficDoughnut({ geoTrafficData, relevant_continents }) {
  if (!geoTrafficData) return null;

  return (
    <div>
      <div className="px-2">
        <GenericDoughnut
          chartData={convertToGeoDoughnutData(geoTrafficData, "traffic")}
          title={"Geography"}
        />
      </div>
    </div>
  );
}

export default WebGeoTrafficDoughnut;
