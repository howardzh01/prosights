import { useState, useEffect } from "react";
import Image from "next/image";
import InvestorTable from "./InvestorTable";
import DescriptionTable from "./DescriptionTable";
import InvestmentsTable from "./InvestmentsTable";

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
    // const descriptionResponse = await fetch(
    //   `/api/private/getCompanyDescription`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       companyName: companyName,
    //       crunchbaseDescription: data["fields"]["description"],
    //     }),
    //   }
    // );
    // if (!descriptionResponse.ok) {
    //   console.log(descriptionResponse.status);
    // }
    // data["fields"]["description"] = await descriptionResponse.text();
    // console.log("WHAT", data);

    setCrunchbaseData(data);
  };
  console.log(crunchbaseData);
  if (!crunchbaseData) {
    return <div>Loading</div>;
  }
  let cbfields = crunchbaseData["fields"];
  return (
    <div>
      <h2 className="text-2xl font-bold" id="companyOverview">
        Company Overview
      </h2>
      {/* <div>{cbfields["website_url"]}</div> */}

      <div className="flex gap-6">
        <DescriptionTable
          descriptionData={{
            logo: cbfields["image_url"],
            description: cbfields["description"],
            founded: cbfields["founded_on"]["value"],
            funding: cbfields["funding_total"]["value_usd"],
            location: `${cbfields["location_identifiers"][0]["value"]} ${cbfields["location_identifiers"][1]["value"]}`,
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
    </div>
  );
}

export default CompanySummaryView;
