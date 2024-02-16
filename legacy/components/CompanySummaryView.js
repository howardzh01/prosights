import { useState, useEffect } from "react";
import InvestorTable from "./InvestorTable";
import DescriptionTable from "./DescriptionTable";
import InvestmentsTable from "./InvestmentsTable";
import Link from "next/link";
import { fromUnderscoreCase } from "../utils/Utils";

function CompanySummaryView({
  user,
  companyName,
  crunchbaseData,
  companyDescription,
}) {
  if (!crunchbaseData) {
    return <div>Loading</div>;
  }

  let cbfields = crunchbaseData["fields"];
  return (
    <div className="flex flex-col mt-3">
      <div className="flex flex-col md:flex-row w-full justify-between">
        <h2 className="text-2xl font-bold" id="companyOverview">
          Company Overview
        </h2>

        {/* Attribution Requirements from https://data.crunchbase.com/docs/using-the-api */}
        <Link
          href={`https://www.crunchbase.com/organization/${companyName}`}
          target="_blank"
          className="text-sm italic md:self-end"
        >
          Powered by Crunchbase
        </Link>
      </div>
      {/* <div>{cbfields["website_url"]}</div> */}

      <div className="flex flex-col xl:flex-row gap-6 xl:h-64 mt-2">
        <div className="flex flex-col items-start gap-2 w-full xl:w-1/4 max-h-64 xl:max-h-none">
          <p className="text-xl font-semibold">Description</p>
          <DescriptionTable
            descriptionData={{
              // TODO: pass in a placeholder image URL if there is no image for some companies (got no image from flight-club)
              logo: cbfields["image_url"] || "",
              description: companyDescription
                ? companyDescription["company_description"]
                : "Loading...",
              founded: cbfields["founded_on"]["value"],
              funding: cbfields["funding_total"]
                ? cbfields["funding_total"]["value_usd"]
                : null,
              location: cbfields["location_identifiers"]
                ? `${cbfields["location_identifiers"][0]["value"]}, ${cbfields["location_identifiers"][1]["value"]}`
                : "",
            }}
          ></DescriptionTable>
          {companyDescription && (
            <div>
              <ul className="list-disc">
                {Object.entries(companyDescription?.["business_model"]).map(
                  ([key, value]) => (
                    <li key={key}>{`${fromUnderscoreCase(key)}: ${value}`}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 w-full xl:w-1/2 max-h-64 xl:max-h-none">
          <p className="text-xl font-semibold">Funding</p>
          <InvestorTable
            fundingData={crunchbaseData["raised_funding_rounds"]}
          ></InvestorTable>
        </div>

        <div className="flex flex-col items-start gap-2 w-full xl:w-1/4 max-h-64 xl:max-h-none">
          <p className="text-xl font-semibold">Investments & M&A</p>
          <InvestmentsTable
            investmentsData={{
              investments: crunchbaseData["participated_investments"],
              acquisitions: crunchbaseData["acquiree_acquisitions"],
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div className="flex flex-col items-start gap-2 h-56">
          <p className="text-xl font-semibold">Headcount</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2 h-56">
          <p className="text-xl font-semibold">Website Traffic</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2 h-56">
          <p className="text-xl font-semibold">App Usage</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2 h-56">
          <p className="text-xl font-semibold">Revenue Momentum</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2 h-56">
          <p className="text-xl font-semibold">Ad Spend</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2 h-56">
          <p className="text-xl font-semibold">Section</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default CompanySummaryView;