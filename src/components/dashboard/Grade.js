import React from "react";
import { Skeleton } from "@nextui-org/react";

const Grade = ({
  overallScore,
  netAssetQualityScore,
  netMomentumScore,
  dataLoading,
}) => {
  const getColor = (score) => {
    if (score >= 60) {
      return "text-green-500";
    } else if (score >= 30) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  return dataLoading ? (
    <Skeleton className="w-full mt-2 h-60 rounded-lg bg-customGray-50" />
  ) : (
    <div className="flex flex-col space-y-4 mt-4">
      <div className="flex flex-col">
        <p
          className={`text-3xl font-bold ${getColor(Math.round(overallScore))}`}
        >
          {Math.round(overallScore)}%
        </p>
        <p className="text-sm text-customGray-500">Overall Grade</p>
      </div>
      <div className="flex flex-col">
        <p
          className={`text-3xl font-bold ${getColor(
            Math.round(netAssetQualityScore)
          )}`}
        >
          {Math.round(netAssetQualityScore)}%
        </p>
        <p className="text-sm text-customGray-500">Asset Quality</p>
      </div>
      <div className="flex flex-col">
        <p
          className={`text-3xl font-bold ${getColor(
            Math.round(netMomentumScore)
          )}`}
        >
          {Math.round(netMomentumScore)}%
        </p>
        <p className="text-sm text-customGray-500">Momentum</p>
      </div>
    </div>
  );
};

export default Grade;
