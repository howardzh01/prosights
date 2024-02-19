import React, { useDebugValue, useEffect, useState } from "react";
import HeadCountSignal from "../signals/HeadCountSignal";
import WebUsersSignal from "../signals/WebUsersSignal";
import AppUsersSignal from "../signals/AppUsersSignal";
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
import Image from "next/image";
import CompanyOverviewIcon from "/public/assets/CompanyOverviewIcon.svg";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function OverviewSection({
  companyAbout,
  crunchbaseData,
  headCountData,
  webTrafficData,
  appData,
  country,
}) {
  // headcountData comes sorted by date
  function formatCrunchbaseHeadcount(headcountRange) {
    // c_01001_05000 => 1001-5000
    if (headcountRange === "c_10001_max") {
      return "10,000+";
    }
    return headcountRange
      .split("_")
      .slice(1)
      .map((num) => parseInt(num, 10))
      .join("-");
  }

  const cbfields = crunchbaseData?.["fields"] || {};
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
    : "";

  let companyLastRoundSize = cbfields["last_equity_funding_total"]?.[
    "value_usd"
  ]
    ? "$" + formatMoney(cbfields["last_equity_funding_total"]?.["value_usd"])
    : "";
  let companyLastDealType = cbfields["last_funding_type"]
    ? formatDealRound(cbfields["last_funding_type"])
    : "";

  /* Business Model */
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
    <div className="mt-4 w-full">
      {/* <hr className="border-none h-px bg-customGray-200" /> */}
      <div className="flex items-end justify-between mt-2 mb-3 rounded-md">
        <div className="flex flex-row items-center">
          <CompanyOverviewIcon className="mx-2 filter invert w-6 h-6" />
          <p className="text-3xl font-semibold text-gray-800 ">
            Company Overview
          </p>
        </div>
        {/* <div className="flex flex-row items-center ml-4">
          <span className="mr-2 italic text-sm text-[#C3C3C3]">Powered by</span>
          <Image
            src="/assets/poweredByLogos/crunchbase_logo.svg"
            alt="coresignal"
            width="120"
            height="120"
            className="h-3 w-auto"
          />
        </div> */}
      </div>
      {/* <hr className="border-none h-px bg-customGray-100" /> */}
      <div className="flex flex-row mt-4 section-indent w-full">
        {/* About & Business Model */}
        <div className="flex flex-col w-3/5 pr-16">
          <div className="text-lg font-semibold text-gray-800">About</div>
          {/* NOTE: companyAbout depends on crunchbase data */}
          {companyAbout ? (
            <p className="text-sm text-customGray-800 leading-relaxed mt-1">
              {companyAbout["company_description"]}
            </p>
          ) : crunchbaseData === null ? (
            <p className="text-sm text-customGray-300 italic leading-relaxed mt-1">
              Description not available
            </p>
          ) : (
            <Skeleton className="bg-customGray-50 text-sm text-customGray-800 leading-relaxed mt-1 rounded-lg">
              Zillow is a leading online real estate marketplace that provides
              comprehensive data, tools, and services for buying, selling,
              renting, and financing homes.
            </Skeleton>
          )}
          <div className="text-lg font-semibold text-gray-800 mt-6">
            Business Model
          </div>
          {companyBusinessModel ? (
            <div className="text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1">
              {companyBusinessModel}
            </div>
          ) : crunchbaseData === null ? (
            <p className="text-sm text-customGray-300 italic leading-relaxed mt-1">
              Business model not available
            </p>
          ) : (
            <Skeleton className="bg-customGray-50 text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1 rounded-lg">
              Advertising (primary): Zillow generates revenue through targeted
              advertising services sold to real estate professionals.
              Marketplace Services (other): The company connects home and
              mortgage shoppers with professionals, earning money from lead
              generation and other marketplace services.
            </Skeleton>
          )}
        </div>
        {/* Basic Stats */}
        <div
          className="w-2/5"
          style={{
            display: "grid",
            gridTemplateColumns: "min-content max-content 1fr",
            gridTemplateRows: "auto auto",
            columnGap: "2.5rem",
            rowGap: "1rem",
          }}
        >
          <div
            className="flex flex-col items-start mr-8"
            style={{ gridRow: "1", gridColumn: "1" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyFoundedYear ? (
                companyFoundedYear
              ) : crunchbaseData === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  2005
                </Skeleton>
              ) : (
                "—"
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
              ) : headCountData === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  7,901
                </Skeleton>
              ) : (
                "—"
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
              ) : crunchbaseData === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  Seattle, WA
                </Skeleton>
              ) : (
                "—"
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
              ) : crunchbaseData === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  $350M
                </Skeleton>
              ) : (
                "—"
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
              ) : crunchbaseData === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  $4.1M
                </Skeleton>
              ) : (
                "—"
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
              ) : crunchbaseData === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  Post-IPO
                </Skeleton>
              ) : (
                "—"
              )}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Last Deal Type
            </div>
          </div>
        </div>
      </div>
      {/* Funding and M&A Tables */}
      <div className="flex mt-6 ml-4 justify-between w-full">
        <div className="w-3/5 pr-16">
          <p className="text-lg font-semibold text-gray-800 mb-3">Funding</p>{" "}
          {crunchbaseData?.["raised_funding_rounds"] ? (
            <InvestorTable
              fundingData={crunchbaseData?.["raised_funding_rounds"]}
            ></InvestorTable>
          ) : crunchbaseData === undefined ? (
            <Skeleton className="bg-customGray-50 w-full h-36 rounded-lg" />
          ) : (
            <div className="bg-customGray-50 w-full h-36 rounded-lg flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Funding Data Available
              </p>
            </div>
          )}
        </div>
        <div className="w-2/5">
          <p className="text-lg font-semibold text-gray-800 mb-3">M&A</p>
          {crunchbaseData?.["participated_investments"] &&
          crunchbaseData?.["acquiree_acquisitions"] ? (
            <InvestmentsTable
              investmentsData={{
                investments: crunchbaseData?.["participated_investments"],
                acquisitions: crunchbaseData?.["acquiree_acquisitions"],
              }}
            />
          ) : crunchbaseData === undefined ? (
            <Skeleton className="bg-customGray-50 h-36 w-full rounded-lg" />
          ) : (
            <div className="bg-customGray-50 h-36 w-full rounded-lg flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No M&A Data Available
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Signals */}
      <div className="flex flex-col mt-6 ml-4">
        <div className="text-lg font-semibold text-gray-800">Signals</div>
        <div className="space-x-6 items-align flex mt-4 justify-between">
          {headCountData ? (
            <div className="md:w-64 2xl:w-[30rem] px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50 h-60">
              <div className="bg-white">
                <HeadCountSignal headCountData={headCountData} />
              </div>
              <div className="flex flex-row items-center">
                <span className="mr-2 italic text-xs text-[#C3C3C3]">
                  Powered by
                </span>
                <Image
                  src="/assets/poweredByLogos/coresignal_logo.svg"
                  alt="coresignal"
                  width="64"
                  height="64"
                  className
                />
              </div>
            </div>
          ) : headCountData === undefined ? (
            <Skeleton className="md:w-64 2xl:w-[30rem] h-60 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          ) : (
            <div className="md:w-64 2xl:w-[30rem] px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50 h-60">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-customGray-200">
                  No Headcount Data Available
                </p>
              </div>
            </div>
          )}
          {webTrafficData && Object.keys(webTrafficData).length !== 0 ? (
            <div className="md:w-64 2xl:w-[30rem] px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50 h-60">
              <div className="bg-white">
                <WebUsersSignal
                  webTrafficData={webTrafficData}
                  country={country}
                />
              </div>
              <div className="flex flex-row items-center">
                <span className="mr-2 italic text-xs text-[#C3C3C3]">
                  Powered by
                </span>
                <Image
                  src="/assets/poweredByLogos/semrush_logo.svg"
                  alt="coresignal"
                  width="64"
                  height="64"
                  className
                />
              </div>
            </div>
          ) : webTrafficData === undefined ? (
            <Skeleton className="md:w-64 2xl:w-[30rem] h-60 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          ) : (
            <div className="md:w-64 2xl:w-[30rem] px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50 h-60">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-customGray-200">
                  No Web Users Data Available
                </p>
              </div>
            </div>
          )}
          {appData ? (
            <div className="md:w-64 2xl:w-[30rem] px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-white border border-customGray-50 h-60">
              <div className="bg-white">
                <AppUsersSignal appData={appData} country={country} />
              </div>
              <div className="flex flex-row items-center">
                <span className="mr-2 italic text-xs text-[#C3C3C3]">
                  Powered by
                </span>
                <Image
                  src="/assets/poweredByLogos/data_ai_logo.svg"
                  alt="coresignal"
                  width="64"
                  height="64"
                  className
                />
              </div>
            </div>
          ) : appData === undefined ? (
            <Skeleton className="md:w-64 2xl:w-[30rem] h-60 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
          ) : (
            <div className="md:w-64 2xl:w-[30rem] px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50 h-60">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-customGray-200">
                  No App Users Data Available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;
