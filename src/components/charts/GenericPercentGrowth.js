import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

function GenericPercentGrowth({ data }) {
  return (
    <div className="">
      <span className="text-xs font-semibold">% Growth</span>

      <div className="bg-gray-200 p-2 flex justify-between">
        <div className="flex space-x-1 overflow-auto">
          {data &&
            data.map((growth, index) => (
              <span key={index} className="text-xs">
                [{growth}]%
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
export default GenericPercentGrowth;
