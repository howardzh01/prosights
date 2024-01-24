import { useState, useEffect } from "react";
import Image from "next/image";
import { formatMoney, formatDealRound, dateToMonths } from "../utils/Utils";

function InvestorTable({ fundingData }) {
  console.log(fundingData);
  if (!fundingData) {
    return <div>Loading</div>;
  }
  function TableHeader({ text, is_header = true }) {
    if (is_header) {
      return <th className=" px-4 py-2 text-center">{text}</th>;
    } else {
      return <td className="px-4 py-2 text-center">{text}</td>;
    }
  }

  return (
    <div className="w-full max-h-36 overflow-auto bg-white drop-shadow-sm rounded-md">
      <table className="bg-white text-center text-sm w-full">
        <thead>
          <tr className="bg-customGray-50 font-medium sticky top-0">
            <TableHeader text="Round" />
            <TableHeader text="Date" />
            <TableHeader text="Valuation" />
            <TableHeader text="Raised" />
            <TableHeader text="Lead Investors" />
          </tr>
        </thead>
        <tbody>
          {fundingData.map((row, index) => (
            <tr key={index}>
              <TableHeader
                text={formatDealRound(row["investment_type"])}
                is_header={false}
              />
              <TableHeader
                text={
                  row["announced_on"]
                    ? dateToMonths(row["announced_on"])
                    : undefined
                }
                is_header={false}
              />
              <TableHeader
                text={
                  row["post_money_valuation"]?.["value_usd"]
                    ? "$" +
                      formatMoney(row["post_money_valuation"]["value_usd"])
                    : "-"
                }
                is_header={false}
              />
              <TableHeader
                text={
                  row["money_raised"]?.["value_usd"]
                    ? "$" + formatMoney(row["money_raised"]["value_usd"])
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
