import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

function TwoColumnView({ title, quarterGraph, yearGraph }) {
  return (
    <div className="h-64">
      <p className="text-2xl font-bold">{title}</p>
      <div className="flex justify-center">
        <div className="w-3/4">{quarterGraph}</div>
        <div className="w-1/4 ml-8">{yearGraph}</div>
      </div>
      {/* <div className="w-3/4">
        <GenericPercentGrowth
          data={convertToGrowthData(
            aggregateData(trafficData, "visits", "sum", "quarterYear")
          )}
        ></GenericPercentGrowth>
      </div> */}
    </div>
  );
}
export default TwoColumnView;
