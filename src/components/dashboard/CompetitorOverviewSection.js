import React, { useEffect } from "react";
import { US_STATE_TO_ABBREV } from "../../constants";
import {
  fromUnderscoreCase,
  formatMoney,
  formatDealRound,
  formatNumberToAbbreviation,
  roundPeNumbers,
} from "../../utils/Utils";
import Image from "next/image";
import CompetitorOverviewIcon from "/public/assets/CompetitorOverviewIcon.svg";
import { Skeleton } from "@nextui-org/react";
import CompanyLogoSkeleton from "./CompanyLogoSkeleton";

function CompetitorOverviewSection({
  companyDescriptions,
  companyInfo,
  companyDic,
  crunchbaseData,
  headCountData,
  companyCompetitors,
}) {
  let competitors = [];

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

  if (companyDescriptions && companyInfo) {
    competitors = Object.keys(companyDescriptions).map((companyName) => {
      let rawCompanyHeadcount = headCountData?.[companyName]
        ? Object.values(headCountData[companyName]).slice(-1)[0]["headcount"]
        : "";
      if (!rawCompanyHeadcount) {
        rawCompanyHeadcount = companyInfo[companyName]?.[
          "Employee Count (Jan 24)"
        ]
          ? parseInt(companyInfo[companyName]["Employee Count (Jan 24)"])
          : "";
      }
      let companyHeadcount = rawCompanyHeadcount
        ? rawCompanyHeadcount > 10000
          ? formatNumberToAbbreviation(rawCompanyHeadcount)
          : roundPeNumbers(rawCompanyHeadcount)
        : "";

      return {
        logo: "--",
        name: companyName,
        companyAbout: companyDescriptions[companyName]
          ? companyDescriptions[companyName].company_description
          : "--",
        companyHeadquarters: companyInfo[companyName]
          ? companyInfo[companyName]["headquarter_country"]
          : "--",
        companyHeadcount: companyHeadcount ? companyHeadcount : "--",
        companyTotalRaised: companyInfo[companyName]
          ? !companyInfo[companyName]["Total Funding Amount (Amount)"]
            ? "--"
            : `$${formatNumberToAbbreviation(
                Math.round(
                  companyInfo[companyName]["Total Funding Amount (Amount)"]
                )
              )}`
          : "",
        companyLastFundedDate: companyInfo[companyName]
          ? companyInfo[companyName]["Last Funded In (Date)"]
            ? companyInfo[companyName]["Last Funded In (Date)"]
            : "--"
          : "--",
        companyLastDealType: companyInfo[companyName]
          ? companyInfo[companyName]["Funding Stage (Type)"].replace(
              "Unfunded",
              "--"
            )
          : "--",
      };
    });
  }

  //   if (companyDescriptions && crunchbaseData && headCountData) {
  //     competitors = Object.keys(companyDescriptions).map((companyName) => {
  //       let companyHeadcount = headCountData[companyName]
  //         ? Object.values(headCountData[companyName])
  //             .slice(-1)[0]
  //             ["headcount"].toLocaleString()
  //         : undefined;
  //       if (!headCountData[companyName]) {
  //         companyHeadcount = crunchbaseData[companyName].fields[
  //           "num_employees_enum"
  //         ]
  //           ? formatCrunchbaseHeadcount(
  //               crunchbaseData[companyName].fields["num_employees_enum"]
  //             )
  //           : "--";
  //       }
  //
  //       return {
  //         logo: crunchbaseData[companyName]
  //           ? crunchbaseData[companyName].fields.image_url
  //           : "--",
  //         name: companyName,
  //         companyAbout: companyDescriptions[companyName]
  //           ? companyDescriptions[companyName].company_description
  //           : "--",
  //         companyHeadquarters: crunchbaseData[companyName]
  //           ? crunchbaseData[companyName].fields["location_identifiers"]
  //             ? `${
  //                 crunchbaseData[companyName].fields["location_identifiers"][0][
  //                   "value"
  //                 ]
  //               }, ${
  //                 US_STATE_TO_ABBREV[
  //                   crunchbaseData[companyName].fields["location_identifiers"][1][
  //                     "value"
  //                   ].toLowerCase()
  //                 ]
  //               }`
  //             : "--"
  //           : "--",
  //         companyHeadcount: companyHeadcount ? companyHeadcount : "--",
  //         companyValuation: crunchbaseData[companyName]
  //           ? crunchbaseData[companyName].fields["valuation"]?.["value_usd"]
  //             ? "$" +
  //               formatMoney(
  //                 crunchbaseData[companyName].fields["valuation"]["value_usd"]
  //               )
  //             : "--"
  //           : "--",
  //         companyLastRoundSize: crunchbaseData[companyName]
  //           ? crunchbaseData[companyName].fields["last_equity_funding_total"]?.[
  //               "value_usd"
  //             ]
  //             ? "$" +
  //               formatMoney(
  //                 crunchbaseData[companyName].fields[
  //                   "last_equity_funding_total"
  //                 ]?.["value_usd"]
  //               )
  //             : "--"
  //           : "--",
  //         companyLastDealType: crunchbaseData[companyName]
  //           ? crunchbaseData[companyName].fields["last_funding_type"]
  //             ? formatDealRound(
  //                 crunchbaseData[companyName].fields["last_funding_type"]
  //               )
  //             : "--"
  //           : "--",
  //       };
  //     });
  //   }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-end justify-between mt-2 mb-3 rounded-md">
        <div className="flex flex-row items-center">
          <CompetitorOverviewIcon className="mx-2 filter invert w-6 h-6" />
          <p className="text-3xl font-semibold text-gray-800 ">
            Competitor Overview
          </p>
        </div>
        <div className="flex flex-row items-center ml-4">
          <span className="mr-2 italic text-sm text-[#C3C3C3]">Powered by</span>
          <Image
            src="/assets/poweredByLogos/crunchbase_logo.svg"
            alt="coresignal"
            width="120"
            height="120"
            className="h-3 w-auto"
          />
        </div>
      </div>
      <hr className="border-none h-px bg-customGray-100" />
      <div className="flex flex-wrap justify-center gap-10 p-5">
        {companyCompetitors.length === 0 ? (
          <div className="w-full h-80 rounded-lg bg-transparent flex items-center justify-center">
            <p className="text-2xl font-medium text-customGray-150">
              Add Competitors to Compare
            </p>
          </div>
        ) : !companyDescriptions || !headCountData ? (
          <Skeleton className="w-full h-80 rounded-lg bg-customGray-50" />
        ) : (
          <>
            {competitors.map((competitor, index) => (
              <div
                key={index}
                className="max-w-sm bg-white rounded-lg px-6 py-4 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] border border-customGray-50 flex flex-col justify-between"
              >
                <div className="flex flex-col mb-4">
                  <div className="flex flex-row items-center">
                    {competitor.logo === "--" ? (
                      <div className="w-8 h-8 mr-2 text-2xl">
                        <CompanyLogoSkeleton name={competitor.name} />
                      </div>
                    ) : (
                      <Image
                        src={competitor.logo}
                        className="w-8 h-8 mr-2 object-contain rounded-md"
                        width={256}
                        height={256}
                        alt="Company Logo"
                      />
                    )}
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                      {competitor.name}
                    </h5>
                  </div>
                  <p className="text-sm text-gray-800 mt-3 leading-relaxed">
                    {competitor.companyAbout}
                  </p>
                </div>
                <div className="mt-6 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-normal text-gray-500">
                      HQ Location
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {competitor.companyHeadquarters}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-normal text-gray-500">
                      Employees
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {competitor.companyHeadcount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-normal text-gray-500">
                      Total Raised
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {competitor.companyTotalRaised}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-normal text-gray-500">
                      Last Funded Date
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {competitor.companyLastFundedDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-normal text-gray-500">
                      Last Deal Type
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {competitor.companyLastDealType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default CompetitorOverviewSection;
