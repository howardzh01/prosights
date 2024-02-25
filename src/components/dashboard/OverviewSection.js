import React, { useDebugValue, useEffect, useState } from "react";
import HeadCountSignal from "../signals/HeadCountSignal";
import WebUsersSignal from "../signals/WebUsersSignal";
import AppUsersSignal from "../signals/AppUsersSignal";
import { createContext } from "react";
import {
  fromUnderscoreCase,
  formatMoney,
  formatDealRound,
  formatNumberToAbbreviation,
} from "../../utils/Utils";
import { getCompanyDescription } from "../../api";
import { US_STATE_TO_ABBREV } from "../../constants";
import InvestorTable from "../InvestorTable";
import InvestmentsTable from "../InvestmentsTable";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";
import CompanyOverviewIcon from "/public/assets/CompanyOverviewIcon.svg";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function OverviewSection({
  companyInfo,
  companyAbout,
  crunchbaseData,
  headCountData,
  webTrafficData,
  appData,
  country,
}) {
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [showBusinessModelPopup, setShowBusinessModelPopup] = useState(false);
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

  let companyFoundedYear = companyInfo ? companyInfo[0]["founded_in_year"] : "";
  let companyHeadcount = companyInfo
    ? Math.round(companyInfo[0]["Employee Count (Jan 24)"])
    : "";
  let companyHeadquarters = companyInfo
    ? companyInfo[0]["headquarter_country"]
    : "";
  let companyTotalRaised = companyInfo
    ? `$${formatNumberToAbbreviation(
        Math.round(companyInfo[0]["Total Funding Amount (Amount)"])
      )}`
    : "";
  let companyLastDealType = companyInfo
    ? companyInfo[0]["Funding Stage (Type)"]
    : "";
  let companyLastFundedDate = companyInfo
    ? companyInfo[0]["Last Funded In (Date)"]
    : "";

  //   const cbfields = crunchbaseData?.["fields"] || {};
  //   let companyFoundedYear = cbfields["founded_on"]
  //     ? new Date(cbfields["founded_on"]?.["value"]).getUTCFullYear()
  //     : "";
  //   let companyHeadcount = headCountData
  //     ? Object.values(headCountData).slice(-1)[0]["headcount"].toLocaleString()
  //     : undefined;
  //   if (!headCountData) {
  //     companyHeadcount = cbfields["num_employees_enum"]
  //       ? formatCrunchbaseHeadcount(cbfields["num_employees_enum"])
  //       : "";
  //   }
  //
  //   let companyHeadquarters = cbfields["location_identifiers"]
  //     ? `${cbfields["location_identifiers"][0]["value"]}, ${
  //         US_STATE_TO_ABBREV[
  //           cbfields["location_identifiers"][1]["value"].toLowerCase()
  //         ]
  //       }`
  //     : "";
  //   let companyValuation = cbfields["valuation"]?.["value_usd"]
  //     ? "$" + formatMoney(cbfields["valuation"]["value_usd"])
  //     : "";
  //
  //   let companyLastRoundSize = cbfields["last_equity_funding_total"]?.[
  //     "value_usd"
  //   ]
  //     ? "$" + formatMoney(cbfields["last_equity_funding_total"]?.["value_usd"])
  //     : "";
  //   let companyLastDealType = cbfields["last_funding_type"]
  //     ? formatDealRound(cbfields["last_funding_type"])
  //     : "";

  //   let companyBusinessModel = "";
  //
  //   let companyDescription = companyInfo
  //     ? getCompanyDescription([
  //         companyInfo[0][
  //           ("displayedName",
  //           `/api/private/getCompanyDescription`,
  //           "",
  //           companyInfo[0]["description"])
  //         ],
  //       ]).then((res) => {
  //         console.log("got result", res);
  //         companyBusinessModel = (
  //           <div>
  //             <ul className="list-disc pl-3">
  //               {Object.entries(res?.["business_model"]).map(
  //                 ([key, value], index) => (
  //                   <li key={key}>
  //                     <strong>
  //                       {`${fromUnderscoreCase(key)}`}
  //                       {index === 0 && <span> (primary)</span>}
  //                       {index !== 0 && <span> (other)</span>}
  //
  //                       {": "}
  //                     </strong>{" "}
  //                     {value}
  //                   </li>
  //                 )
  //               )}
  //             </ul>
  //           </div>
  //         );
  //         return res;
  //       })
  //     : "";
  //   console.log("uh", companyDescription);

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
          <div className="relative flex flex-row items-center">
            <div className="text-lg font-semibold text-gray-800 mr-2">
              About
            </div>
            <div
              className="group cursor-pointer"
              onMouseOver={() => setShowAboutPopup(true)}
              onMouseOut={() => setShowAboutPopup(false)}
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
              className="absolute block bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 text-sm z-50"
              style={{
                display: showAboutPopup ? "block" : "none",
              }}
            >
              <span>
                <strong>Field:</strong> Explains what a company does, using
                proprietary LLM model that is trained with real-time web data
                and tailored to investor preferences.
              </span>
            </div>
          </div>
          {/* NOTE: companyAbout depends on crunchbase data */}
          {companyAbout ? (
            <p className="text-sm text-customGray-800 leading-relaxed mt-1">
              {companyAbout["company_description"]}
            </p>
          ) : companyInfo === null ? (
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
          <div className="relative flex flex-row items-center mt-6">
            <div className="text-lg font-semibold text-gray-800 mr-2">
              Business Model
            </div>
            <div
              className="group cursor-pointer"
              onMouseOver={() => setShowBusinessModelPopup(true)}
              onMouseOut={() => setShowBusinessModelPopup(false)}
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
              className="absolute block bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 text-sm z-50"
              style={{
                display: showBusinessModelPopup ? "block" : "none",
              }}
            >
              <span>
                <strong>Field:</strong> Explains how the company makes money,
                using proprietary LLM model that is trained with real-time web
                data and tailored to investor preferences.
              </span>
            </div>
          </div>
          {companyBusinessModel ? (
            <div className="text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1">
              {companyBusinessModel}
            </div>
          ) : companyInfo === null ? (
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
            rowGap: "1.5rem",
          }}
        >
          <div
            className="flex flex-col items-start mr-8"
            style={{ gridRow: "1", gridColumn: "1" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyFoundedYear ? (
                companyFoundedYear
              ) : companyInfo === undefined ? (
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
              ) : companyInfo === undefined ? (
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
              ) : companyInfo === undefined ? (
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
              {companyTotalRaised ? (
                companyTotalRaised
              ) : companyInfo === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  $350M
                </Skeleton>
              ) : (
                "—"
              )}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Total Raised
            </div>
          </div>
          <div
            className="flex flex-col items-start"
            style={{ gridRow: "2", gridColumn: "2" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyLastFundedDate ? (
                companyLastFundedDate
              ) : companyInfo === undefined ? (
                <Skeleton className="text-primary font-bold text-4xl rounded-lg bg-customGray-50">
                  $4.1M
                </Skeleton>
              ) : (
                "—"
              )}
            </div>
            <div className="text-sm text-customGray-500 font-light mt-1">
              Last Funded Date
            </div>
          </div>
          <div
            className="flex flex-col items-start"
            style={{ gridRow: "2", gridColumn: "3" }}
          >
            <div className="text-primary font-bold text-4xl">
              {companyLastDealType ? (
                companyLastDealType
              ) : companyInfo === undefined ? (
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
      {/* <div className="flex mt-6 ml-4 justify-between w-full">
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
      </div> */}
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
