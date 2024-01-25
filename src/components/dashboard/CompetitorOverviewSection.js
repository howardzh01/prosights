import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";
import CompetitorOverviewIcon from "/public/assets/CompetitorOverviewIcon.svg";

function CompetitorOverviewSection({}) {
  return (
    <div className="flex flex-col w-full mt-12">
      <div className="flex items-center py-1 bg-customGray-50 rounded-md">
        <CompetitorOverviewIcon className="mx-2 filter invert" />
        <p className="text-2xl font-semibold text-gray-800  ">
          Competitor Overview
        </p>
      </div>
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
