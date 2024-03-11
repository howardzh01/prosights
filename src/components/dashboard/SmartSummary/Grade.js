import React, { useState } from "react";
import { INFO_HOVERS } from "../../../constants";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";

const Grade = ({
  overallScore,
  netAssetQualityScore,
  netMomentumScore,
  dataLoading,
}) => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const getColor = (score) => {
    if (score >= 60) {
      return "text-green-500";
    } else if (score >= 30) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  return (
    <div className="w-1/12 flex flex-col">
      <div className="flex flex-row items-center relative">
        <p className="font-semibold text-lg text-customGray-800 mr-2">Grade</p>
        {/* <div
          className="group cursor-pointer"
          onMouseOver={() => setShowInfoPopup(true)}
          onMouseOut={() => setShowInfoPopup(false)}
        >
          <Image
            src="/assets/info.svg"
            alt="info"
            width={128}
            height={128}
            className="w-4"
          />
        </div>
        <div
          id="infoPopup"
          className="absolute block bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 text-xs z-50"
          style={{
            display: showInfoPopup ? "block" : "none",
          }}
        >
          {INFO_HOVERS.SUMMARY.ABOUT}
        </div> */}
      </div>
      {dataLoading ? (
        <Skeleton className="w-full h-72 mt-4 rounded-lg bg-customGray-50" />
      ) : (
        <div className="flex flex-col space-y-6 mt-4">
          <div className="flex flex-col">
            <p
              className={`text-3xl font-bold ${getColor(
                Math.round(overallScore)
              )}`}
            >
              {Math.round(overallScore)}%
            </p>
            <p className="text-sm font-light text-customGray-500">
              Overall Grade
            </p>
          </div>
          <div className="flex flex-col">
            <p
              className={`text-3xl font-bold ${getColor(
                Math.round(netAssetQualityScore)
              )}`}
            >
              {Math.round(netAssetQualityScore)}%
            </p>
            <p className="text-sm font-light text-customGray-500">
              Asset Quality
            </p>
          </div>
          <div className="flex flex-col">
            <p
              className={`text-3xl font-bold ${getColor(
                Math.round(netMomentumScore)
              )}`}
            >
              {Math.round(netMomentumScore)}%
            </p>
            <p className="text-sm font-light text-customGray-500">Momentum</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grade;
