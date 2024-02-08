import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficDoughnut from "../charts/WebGeoTrafficDoughnut";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";
import CompetitorOverviewIcon from "/public/assets/CompetitorOverviewIcon.svg";

function CompetitorOverviewSection({}) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-end justify-between mt-2 mb-3 rounded-md">
        <div className="flex flex-row items-center">
          <CompetitorOverviewIcon className="mx-2 filter invert w-6 h-6" />
          <p className="text-3xl font-semibold text-gray-800 ">
            Competitor Overview
          </p>
        </div>
        <div className="flex flex-row items-center ml-4">
          <span className="mr-2 italic text-sm text-[#C3C3C3]">Powered by</span>
          <Image
            src="/assets/poweredByLogos/crunchbase_logo.svg"
            alt="coresignal"
            width="120"
            height="120"
            className="h-3 w-auto"
          />
        </div>
      </div>
      <hr className="border-none h-px bg-customGray-200" />
      <div className="lex flex-col items-center w-full overflow-hidden section-indent mt-4">
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
