import Image from "next/image";
import React from "react";
import { COUNTRY_LIST } from "../../../constants";

function GenericLocationDisplay({ location, lastTwelveMonthsView = false }) {
  if (!location && !lastTwelveMonthsView) return null;

  return (
    <div className="flex flex-row items-center">
      {lastTwelveMonthsView && (
        <>
          <Image
            src="/assets/calendar.svg"
            alt="Company Logo"
            className="w-4 h-4 object-contain mr-1"
            width={128}
            height={128}
          />
          <p className="text-xs font-normal text-customGray-200 mr-4">
            Last 12 Months
          </p>
        </>
      )}
      {location && (
        <>
          <Image
            src="/assets/globe.svg"
            alt="Company Logo"
            className="w-4 h-4 object-contain mr-1"
            width={128}
            height={128}
          />
          <p className="text-xs font-normal text-customGray-200">
            {COUNTRY_LIST?.[location] || location}
          </p>
        </>
      )}
    </div>
    // <div className="flex flex-row mt-3">
    //   <Image
    //     src="/assets/globe.svg"
    //     alt="Company Logo"
    //     className="w-4 h-4 object-contain mr-1"
    //     width={128}
    //     height={128}
    //   />
    //   <p className="text-xs font-normal text-customGray-200">{country}</p>
    // </div>
  );
}

export default GenericLocationDisplay;
