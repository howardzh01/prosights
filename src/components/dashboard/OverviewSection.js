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
import { Skeleton } from "@nextui-org/react";

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
  console.log("CB FIELDS", cbfields);
  let companyFoundedYear = cbfields["founded_on"]
    ? new Date(cbfields["founded_on"]?.["value"]).getUTCFullYear()
    : "";
  let companyHeadcount = headCountData
    ? Object.values(headCountData).slice(-1)[0]["headcount"].toLocaleString()
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
      <div className="flex flex-row mt-4 mx-4 space-x-16">
        {/* About & Business Model */}
        {companyAbout && companyBusinessModel ? (
          <div className="flex flex-col w-1/2">
            <div className="text-base font-semibold text-gray-800">About</div>
            <p className="text-sm text-customGray-800 leading-relaxed mt-1">
              {companyAbout["company_description"]}
            </p>
            <div className="text-base font-semibold text-gray-800 mt-6">
              Business Model
            </div>
            <p className="text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1">
              {companyBusinessModel}
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-1/2 space-y-5">
            <Skeleton className="bg-customGray-50 text-base font-semibold text-gray-800 w-16 h-6 rounded-lg" />
            <Skeleton className="bg-customGray-50 text-sm text-customGray-800 leading-relaxed mt-1 rounded-lg">
              Zillow is a leading online real estate marketplace that provides
              comprehensive data, tools, and services for buying, selling,
              renting, and financing homes.
            </Skeleton>
            <Skeleton className="bg-customGray-50 text-base font-semibold text-gray-800 mt-6 w-16 h-6 rounded-lg"></Skeleton>
            <Skeleton className="bg-customGray-50 text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1 rounded-lg">
              Advertising (primary): Zillow generates revenue through targeted
              advertising services sold to real estate professionals.
              Marketplace Services (other): The company connects home and
              mortgage shoppers with professionals, earning money from lead
              generation and other marketplace services.
            </Skeleton>
          </div>
        )}
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
              {companyFoundedYear ? (
                companyFoundedYear
              ) : (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  2005
                </Skeleton>
              )}
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
              {companyHeadcount ? (
                companyHeadcount
              ) : (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  7,901
                </Skeleton>
              )}
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
              {companyHeadquarters ? (
                companyHeadquarters
              ) : (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  Seattle, WA
                </Skeleton>
              )}
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
              {companyValuation ? (
                companyValuation
              ) : (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  $350M
                </Skeleton>
              )}
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
              {companyLastRoundSize ? (
                companyLastRoundSize
              ) : (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  $4.1M
                </Skeleton>
              )}
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
              {companyLastDealType ? (
                companyLastDealType
              ) : (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  Post-IPO
                </Skeleton>
              )}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Last Deal Type
            </div>
          </div>
        </div>
      </div>
      {/* Funding and M&A Tables */}
      <div className="flex space-x-8 mx-4 mt-6">
        <div className="w-3/5 mr-8">
          <p className="text-base font-semibold text-gray-800 mb-3">Funding</p>{" "}
          {crunchbaseData?.["raised_funding_rounds"] ? (
            <InvestorTable
              fundingData={crunchbaseData?.["raised_funding_rounds"]}
            ></InvestorTable>
          ) : (
            <Skeleton className="bg-customGray-50 w-full h-36 rounded-lg" />
          )}
        </div>
        <div className="">
          <p className="text-base font-semibold text-gray-800 mb-3">M&A</p>
          {crunchbaseData?.["participated_investments"] &&
          crunchbaseData?.["acquiree_acquisitions"] ? (
            <InvestmentsTable
              investmentsData={{
                investments: crunchbaseData?.["participated_investments"],
                acquisitions: crunchbaseData?.["acquiree_acquisitions"],
              }}
            />
          ) : (
            <Skeleton className="bg-customGray-50 h-36 w-96 rounded-lg" />
          )}
        </div>
      </div>

      {/* Signals */}
      <div className="flex flex-col mt-6 mx-4">
        <div className="text-lg font-semibold text-gray-800">Signals</div>
        <div className="space-x-6 items-align flex mt-4">
          {headCountData ? (
            <div className="w-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50">
              <HeadCountSignal headCountData={headCountData} />
            </div>
          ) : (
            <Skeleton className="w-64 h-52 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          )}
          {headCountData ? (
            <div className="w-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50">
              <HeadCountSignal headCountData={headCountData} />
            </div>
          ) : (
            <Skeleton className="w-64 h-52 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          )}
          {headCountData ? (
            <div className="w-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50">
              <HeadCountSignal headCountData={headCountData} />
            </div>
          ) : (
            <Skeleton className="w-64 h-52 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          )}
          {headCountData ? (
            <div className="w-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50">
              <HeadCountSignal headCountData={headCountData} />
            </div>
          ) : (
            <Skeleton className="w-64 h-52 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;
