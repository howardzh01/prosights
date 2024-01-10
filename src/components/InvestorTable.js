import { useState, useEffect } from "react";
import Image from "next/image";

function InvestorTable({ fundingData }) {
  console.log(fundingData);
  if (!fundingData) {
    return <div>Loading</div>;
  }
  function TableHeader({ text, is_header = true }) {
    if (is_header) {
      return <th className="border px-2 py-4 text-center">{text}</th>;
    } else {
      return <td className="border px-2 py-4 text-center">{text}</td>;
    }
  }

  return (
    <div className="overflow-x-auto mx-6">
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr>
            <TableHeader text="Announced Date" />
            <TableHeader text="Rounds" />
            <TableHeader text="Number of Investors" />
            <TableHeader text="Money Raised" />
            <TableHeader text="Post-Money Valuation" />
            <TableHeader text="Lead Investors" />
          </tr>
        </thead>
        <tbody>
          {fundingData.map((row, index) => (
            <tr key={index}>
              <TableHeader text={row["announced_on"]} is_header={false} />
              <TableHeader text={row["investment_type"]} is_header={false} />
              <TableHeader text={row["num_investors"]} is_header={false} />
              <TableHeader
                text={
                  row["money_raised"]
                    ? `$${row["money_raised"]["value_usd"]}`
                    : "-"
                }
                is_header={false}
              />
              <TableHeader
                text={
                  row["post_money_valuation"]
                    ? `$${row["post_money_valuation"]["value_usd"]}`
                    : "-"
                }
                is_header={false}
              />
              <TableHeader
                text={
                  row["lead_investor_identifiers"]
                    ? row["lead_investor_identifiers"]
                        .map((item) => item["value"])
                        .join(", ")
                    : "No Lead Investors"
                }
                is_header={false}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvestorTable;
