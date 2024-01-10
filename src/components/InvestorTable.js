import { useState, useEffect } from "react";
import Image from "next/image";

function InvestorTable({ fundingData }) {
  console.log(fundingData);
  if (!fundingData) {
    return <div>Loading</div>;
  }
  function TableHeader({ text, is_header = true }) {
    if (is_header) {
      return <th className="border px-2 py-2 text-center">{text}</th>;
    } else {
      return <td className="border px-2 py-2 text-center">{text}</td>;
    }
  }

  return (
    <div className="w-1/2 overflow-x-auto">
      <table className="bg-white text-sm w-full">
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
                    ? // check if money raised > 1 billion and if not then just use millions
                      `$${
                        row["money_raised"]["value_usd"] > 1000000000
                          ? row["money_raised"]["value_usd"] / 1000000000
                          : row["money_raised"]["value_usd"] / 1000000
                      }${
                        row["money_raised"]["value_usd"] > 1000000000
                          ? "B"
                          : "M"
                      }`
                    : "-"
                }
                is_header={false}
              />
              <TableHeader
                text={
                  row["post_money_valuation"]
                    ? // check if valuation > 1 billion and if not then just use millions
                      `$${
                        row["post_money_valuation"]["value_usd"] > 1000000000
                          ? row["post_money_valuation"]["value_usd"] /
                            1000000000
                          : row["post_money_valuation"]["value_usd"] / 1000000
                      }${
                        row["post_money_valuation"]["value_usd"] > 1000000000
                          ? "B"
                          : "M"
                      }`
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
