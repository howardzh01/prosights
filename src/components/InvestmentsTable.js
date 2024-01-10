import { useState, useEffect } from "react";
import Image from "next/image";

function InvestmentsTable({ investmentsData }) {
  console.log(investmentsData);
  if (!investmentsData) {
    return <div>Loading</div>;
  }

  function TableHeader({ text, is_header = true }) {
    if (is_header) {
      return <th className="border px-2 py-2 text-center">{text}</th>;
    } else {
      return <td className="border px-2 py-2 text-center">{text}</td>;
    }
  }

  // date
  // type
  // amount
  // valuation

  const combinedData = [];

  investmentsData.investments.forEach((investment) => {
    combinedData.push({
      // date: investment.,
      // type: investment.,
      // amount: investment.,
      // valuation: investment.
    });
  });

  investmentsData.acquisitions.forEach((acquisition) => {
    combinedData.push({
      // date: acquisition.,
      type: acquisition.acquisition_type,
      amount:
        acquisition.acquiree_funding_total.value_usd !== 0
          ? `$${investment.acquiree_funding_total.value_usd}`
          : "-",
      // valuation: acquisition.
    });
  });

  return (
    <div className="w-1/4 overflow-x-auto">
      <table className="bg-white text-sm">
        <thead>
          <tr>
            <TableHeader text="Date" />
            <TableHeader text="Type" />
            <TableHeader text="Amount" />
            <TableHeader text="Valuation" />
          </tr>
        </thead>
        <tbody>
          {combinedData.map((row, index) => (
            <tr key={index}>
              <TableHeader text={row["announced_on"]} is_header={false} />
              <TableHeader text={row["investment_type"]} is_header={false} />
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvestmentsTable;
