import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";

function CompetitorOverviewSection({}) {
  return (
    <div className="flex flex-col w-full mt-12 pb-8">
      <p className="text-2xl font-semibold text-gray-800 ml-2">
        Competitor Overview
      </p>
      <hr className="border-t border-customGray-50 mt-2 mb-4" />
      <div className="mx-4 flex flex-col items-center">
        <Image
          src="/assets/graphPictures/competitorOverview.svg"
          className="h-[32rem] object-contain mt-4"
          width={1024}
          height={1024}
        />
      </div>
    </div>
  );
}

export default CompetitorOverviewSection;
