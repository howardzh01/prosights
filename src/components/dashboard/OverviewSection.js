import React, { useDebugValue, useEffect, useState } from "react";
import HeadCountSignal from "../signals/HeadCountSignal";
import { createContext } from "react";
import {
  fromUnderscoreCase,
  formatMoney,
  formatDealRound,
} from "../../utils/Utils";
import { US_STATE_TO_ABBREV } from "../../constants";
import InvestorTable from "../InvestorTable";
import InvestmentsTable from "../InvestmentsTable";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function OverviewSection({ companyAbout, crunchbaseData, headCountData }) {
  // headccountData comes sorted by date
  function formatCrunchbaseHeadcount(headcountRange) {
    // c_01001_05000 => 1001-5000
    return headcountRange
      .split("_")
      .slice(1)
      .map((num) => parseInt(num, 10))
      .join("-");
  }

  const cbfields = crunchbaseData?.["fields"] || {};
  console.log("CB FIELDS", headCountData);
  let companyFoundedYear = cbfields["founded_on"]
    ? new Date(cbfields["founded_on"]?.["value"]).getUTCFullYear()
    : "";
  let companyHeadcount = headCountData
    ? Object.values(headCountData).slice(-1)[0]["headcount"]
    : undefined;
  if (!headCountData) {
    companyHeadcount = cbfields["num_employees_enum"]
      ? formatCrunchbaseHeadcount(cbfields["num_employees_enum"])
      : "";
  }

  let companyHeadquarters = cbfields["location_identifiers"]
    ? `${cbfields["location_identifiers"][0]["value"]}, ${
        US_STATE_TO_ABBREV[
          cbfields["location_identifiers"][1]["value"].toLowerCase()
        ]
      }`
    : "";
  let companyValuation = cbfields["valuation"]?.["value_usd"]
    ? "$" + formatMoney(cbfields["valuation"]["value_usd"])
    : undefined;

  let companyLastRoundSize = cbfields["last_equity_funding_total"]?.[
    "value_usd"
  ]
    ? "$" + formatMoney(cbfields["last_equity_funding_total"]?.["value_usd"])
    : undefined;
  let companyLastDealType = cbfields["last_funding_type"]
    ? formatDealRound(cbfields["last_funding_type"])
    : "";

  {
    /* Business Model */
  }
  let companyBusinessModel = companyAbout && (
    <div>
      <ul className="list-disc pl-3">
        {Object.entries(companyAbout?.["business_model"]).map(
          ([key, value], index) => (
            <li key={key}>
              <strong>
                {`${fromUnderscoreCase(key)}`}
                {index === 0 && <span> (primary)</span>}
                {index !== 0 && <span> (other)</span>}

                {": "}
              </strong>{" "}
              {value}
            </li>
          )
        )}
      </ul>
    </div>
  );

  return (
    <div className="mt-8 w-full">
      <p className="text-2xl font-semibold text-gray-800 ml-2">Overview</p>
      <hr className="border-t border-customGray-50 mt-2" />
      <div className="flex flex-row mt-4 mx-4 space-x-4">
        {/* About & Business Model */}
        <div className="flex flex-col w-1/2">
          <div className="text-base font-semibold text-gray-800">About</div>
          <p className="text-sm text-customGray-800 leading-relaxed mt-1">
            {companyAbout ? companyAbout["company_description"] : "Loading..."}
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
          className="w-1/2"
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
              {companyValuation}
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
              {companyLastRoundSize}
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
          <p className="text-base font-semibold text-gray-800 mb-3">Funding</p>{" "}
          <InvestorTable
            fundingData={crunchbaseData?.["raised_funding_rounds"]}
          ></InvestorTable>
        </div>
        <div className="">
          <p className="text-base font-semibold text-gray-800 mb-3">M&A</p>
          <InvestmentsTable
            investmentsData={{
              investments: crunchbaseData?.["participated_investments"] || [],
              acquisitions: crunchbaseData?.["acquiree_acquisitions"] || [],
            }}
          />
        </div>
      </div>

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
