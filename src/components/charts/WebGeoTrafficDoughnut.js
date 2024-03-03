import GenericDoughnut from "./templates/GenericDoughnut";
import Image from "next/image";
import { convertToGeoDoughnutData } from "../../utils/ChartUtils";
import { CHARTS, INFO_HOVERS } from "../../constants";

function WebGeoTrafficDoughnut({ geoTrafficData, relevant_continents }) {
  if (!geoTrafficData) return null;

  return (
    <div>
      <div className="px-2">
        <GenericDoughnut
          chartData={convertToGeoDoughnutData(geoTrafficData, "traffic")}
          info={INFO_HOVERS.TRAFFIC.GEOGRAPHY}
          title={"Geography"}
          showModalButtons={true}
          rawChartData={geoTrafficData}
          selectedChart={CHARTS.trafficByGeo}
        />
      </div>
    </div>
  );
}

export default WebGeoTrafficDoughnut;
