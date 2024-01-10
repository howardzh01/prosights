import { useState, useEffect } from "react";
import Image from "next/image";

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

    setCrunchbaseData(data);
  };
  console.log(crunchbaseData);
  if (!crunchbaseData) {
    return <div>Loading</div>;
  }
  let cbfields = crunchbaseData["fields"];
  return (
    <div className="h-64">
      <h1 className="text-2xl font-bold">Company Overview</h1>
      <p className="text-lg">CRUNCHBASE</p>
      <Image
        src={cbfields["image_url"]}
        alt="Company Image"
        width={50}
        height={50}
      ></Image>
      <div>
        <span className="font-bold text-sm">Description: </span>
        <span className="text-sm">{cbfields["description"]} </span>
      </div>

      <div>Founded on {cbfields["founded_on"]["value"]}</div>

      <div>{cbfields["last_equity_funding_type"]}</div>

      <div>Funding ${cbfields["funding_total"]["value_usd"]}</div>
      <div>
        Valuation ${cbfields["valuation"]["value_usd"]} as of{" "}
        {cbfields["valuation_date"]}
      </div>
      <div>
        Location {cbfields["location_identifiers"][0]["value"]},{" "}
        {cbfields["location_identifiers"][1]["value"]}
      </div>
      <div>{cbfields["website_url"]}</div>
    </div>
  );
}

export default CompanySummaryView;
