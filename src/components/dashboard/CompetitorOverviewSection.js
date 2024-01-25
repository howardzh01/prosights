import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";

function CompetitorOverviewSection({}) {
  return (
    <div className="flex flex-col w-full mt-12">
      <p className="text-2xl font-semibold text-gray-800 ml-2">
        Competitor Overview
      </p>
      <hr className="border-t border-customGray-50 mt-2" />
      <div className="lex flex-col items-center w-full overflow-hidden section-indent">
        <Image
          src="/assets/graphPictures/competitorOverview.svg"
          className="h-[30rem] object-contain"
          width={1500}
          height={1500}
        />
      </div>
    </div>
  );
}

export default CompetitorOverviewSection;
