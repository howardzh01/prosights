import React, { useEffect, useState } from "react";
import HeadCountSignal from "../signals/HeadCountSignal";
import { createContext } from "react";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function OverviewSection({
  companyAbout,
  companyBusinessModel,
  companyFoundedYear,
  companyHeadcount,
  companyHeadquarters,
  companyValuation,
  companyLastRoundSize,
  companyLastDealType,
  headCountData,
}) {
  return (
    <div className="mt-8 w-full">
      <p className="text-2xl font-semibold text-gray-800 ml-2">Overview</p>
      <hr className="border-t border-customGray-50 mt-2" />
      <div className="flex flex-row mt-4 mx-4">
        {/* About & Business Model */}
        <div className="flex flex-col w-1/2 mr-12">
          <div className="text-base font-semibold text-gray-800">About</div>
          <p className="text-sm text-customGray-800 leading-relaxed mt-1">
            {companyAbout}
          </p>
          <div className="text-base font-semibold text-gray-800 mt-6">
            Business Model
          </div>
          <p className="text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1">
            {companyBusinessModel}
          </p>
        </div>
        {/* Basic Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "min-content max-content 1fr",
            gridTemplateRows: "auto auto",
            columnGap: "2.5rem",
          }}
        >
          <div
            className="flex flex-col items-start mr-8"
            style={{ gridRow: "1", gridColumn: "1" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyFoundedYear}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Founded
            </div>
          </div>
          <div
            className="flex flex-col items-start mr-8"
            style={{ gridRow: "1", gridColumn: "2" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyHeadcount}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Headcount
            </div>
          </div>
          <div
            className="flex flex-col items-start"
            style={{ gridRow: "1", gridColumn: "3" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyHeadquarters}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Headquarters
            </div>
          </div>
          <div
            className="flex flex-col items-start"
            style={{ gridRow: "2", gridColumn: "1" }}
          >
            <div className="text-primary font-bold text-4xl">
              ${companyValuation}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Valuation
            </div>
          </div>
          <div
            className="flex flex-col items-start"
            style={{ gridRow: "2", gridColumn: "2" }}
          >
            <div className="text-primary font-bold text-4xl">
              ${companyLastRoundSize}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Last Round
            </div>
          </div>
          <div
            className="flex flex-col items-start"
            style={{ gridRow: "2", gridColumn: "3" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyLastDealType}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Last Deal Type
            </div>
          </div>
        </div>
      </div>
      {/* Funding and M&A Tables */}
      <div className="flex space-x-4 mx-4 mt-6">
        <div className="w-3/5 mr-8">
          <p className="text-base font-semibold text-gray-800 mb-3">Funding</p>
          <div className="bg-white drop-shadow-sm rounded-md">
            <table className="min-w-full">
              <thead>
                <tr className="bg-primaryLight text-center text-sm font-medium">
                  <th className="px-4 py-2 rounded-tl-md">Round</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Valuation</th>
                  <th className="px-4 py-2">Raised</th>
                  <th className="px-4 py-2 rounded-tr-md">Lead Investors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center text-sm">
                  <td className="px-4 py-2">Secondary</td>
                  <td className="px-4 py-2 whitespace-nowrap">Apr 23</td>
                  <td className="px-4 py-2">$3.1B</td>
                  <td className="px-4 py-2">$195M</td>
                  <td className="px-4 py-2">
                    Altimeter Capital, Dragon Investment Group
                  </td>
                </tr>
                <tr className="text-center text-sm">
                  <td className="px-4 py-2">Secondary</td>
                  <td className="px-4 py-2">Apr 23</td>
                  <td className="px-4 py-2">$3.1B</td>
                  <td className="px-4 py-2">$195M</td>
                  <td className="px-4 py-2">
                    Altimeter Capital, Dragon Investment Group
                  </td>
                </tr>
                <tr className="text-center text-sm">
                  <td className="px-4 py-2">Secondary</td>
                  <td className="px-4 py-2">Apr 23</td>
                  <td className="px-4 py-2">$3.1B</td>
                  <td className="px-4 py-2">$195M</td>
                  <td className="px-4 py-2">
                    Altimeter Capital, Dragon Investment Group
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="">
          <p className="text-base font-semibold text-gray-800 mb-3">M&A</p>
          <div className="bg-white drop-shadow-sm rounded-md">
            <table className="min-w-full">
              <thead>
                <tr className="bg-primaryLight text-center text-sm font-medium">
                  <th className="px-4 py-2 rounded-tl-md">Company</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Valuation</th>
                  <th className="px-4 py-2 rounded-tr-md">Seller</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center text-sm">
                  <td className="px-4 py-2">Scout</td>
                  <td className="px-4 py-2">Apr 23</td>
                  <td className="px-4 py-2">$3.1B</td>
                  <td className="px-4 py-2">Goodwater Capital</td>
                </tr>
                <tr className="text-center text-sm">
                  <td className="px-4 py-2">Scout</td>
                  <td className="px-4 py-2">Apr 23</td>
                  <td className="px-4 py-2">$3.1B</td>
                  <td className="px-4 py-2">Goodwater Capital</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Signals */}
      <div className="flex flex-col mt-6 mx-4">
        <div className="text-lg font-semibold text-gray-800">Signals</div>
        <div className="space-x-8 items-align flex mt-4">
          <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
            <HeadCountSignal headCountData={headCountData} />
          </div>
          <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
            <HeadCountSignal headCountData={headCountData} />
          </div>
          <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
            <HeadCountSignal headCountData={headCountData} />
          </div>
          <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
            <HeadCountSignal headCountData={headCountData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;
