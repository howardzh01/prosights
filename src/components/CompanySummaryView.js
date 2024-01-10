import { useState, useEffect } from "react";
import InvestorTable from "./InvestorTable";
import DescriptionTable from "./DescriptionTable";
import InvestmentsTable from "./InvestmentsTable";
import Link from "next/link";

function CompanySummaryView({ user, companyName }) {
  const [crunchbaseData, setCrunchbaseData] = useState(null);

  useEffect(() => {
    updateCrunchbaseData(user, companyName);
  }, [companyName]);

  const updateCrunchbaseData = async (user, companyName) => {
    const response = await fetch(`/api/private/getCrunchbaseData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        companyName: companyName,
      }),
    });
    if (!response.ok) {
      console.log(response.status);
      setCrunchbaseData(null);
    }
    var data = await response.json();
    // data = data.reverse();
    // // transform to  {month: {key:value}}
    // const formattedData = data.reduce((acc, item, i) => {
    //   const month = new Date(item.created);
    //   acc[month] = {
    //     headcount: item.headcount,
    //   };
    //   return acc;
    // }, {});

    // Make request to refine the company description
    const descriptionResponse = await fetch(
      `/api/private/getCompanyDescription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName,
          crunchbaseDescription: data["fields"]["description"],
        }),
      }
    );
    if (!descriptionResponse.ok) {
      console.log(descriptionResponse.status);
    }
    data["fields"]["description"] = await descriptionResponse.text();
    console.log("WHAT", data);

    setCrunchbaseData(data);
  };
  console.log(crunchbaseData);
  if (!crunchbaseData) {
    return <div>Loading</div>;
  }
  let cbfields = crunchbaseData["fields"];
  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-between">
        <h2 className="text-2xl font-bold" id="companyOverview">
          Company Overview
        </h2>

        {/* Attribution Requirements from https://data.crunchbase.com/docs/using-the-api */}
        <Link
          href={`https://www.crunchbase.com/organization/${companyName}`}
          target="_blank"
          className="text-sm italic"
        >
          Powered by Crunchbase
        </Link>
      </div>
      {/* <div>{cbfields["website_url"]}</div> */}

      <div className="flex gap-6 h-64 mt-2">
        <DescriptionTable
          descriptionData={{
            // TODO: pass in a placeholder image URL if there is no image for some companies (got no image from flight-club)
            logo: cbfields["image_url"] || "",
            description: cbfields["description"],
            founded: cbfields["founded_on"]["value"],
            funding: cbfields["funding_total"]
              ? cbfields["funding_total"]["value_usd"]
              : null,
            location: cbfields["location_identifiers"]
              ? `${cbfields["location_identifiers"][0]["value"]} ${cbfields["location_identifiers"][1]["value"]}`
              : "",
          }}
        ></DescriptionTable>

        <InvestorTable
          fundingData={crunchbaseData["raised_funding_rounds"]}
        ></InvestorTable>

        <InvestmentsTable
          investmentsData={{
            investments: crunchbaseData["participated_investments"],
            acquisitions: crunchbaseData["acquiree_acquisitions"],
          }}
        />
      </div>

      <div className="grid gap-6 grid-cols-3 h-64 mt-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-xl font-semibold">Headcount</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-xl font-semibold">Website Traffic</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-xl font-semibold">App Usage</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-3 h-64 mt-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-xl font-semibold">Revenue Momentum</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-xl font-semibold">Ad Spend</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-xl font-semibold">Section</p>
          <div className="border border-primary w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default CompanySummaryView;
