import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";

function AppUsageSection({}) {
  return (
    <div className="flex flex-col w-full mt-12 pb-8">
      <p
        id="App Usage"
        className="content-section text-2xl font-semibold text-gray-800 ml-2"
      >
        App Usage
      </p>
      <hr className="border-t border-customGray-50 mt-2 mb-4" />
      <div className="mx-4 flex flex-col">
        <div id="Visits Breakdown" className="content-section">
          <p className="text-base font-semibold text-gray-800 mb-3">
            App Loyalty vs. Peers
          </p>
          <div className="space-x-6"></div>
        </div>
      </div>
    </div>
  );
}

export default AppUsageSection;
