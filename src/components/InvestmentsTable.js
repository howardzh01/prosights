import { useState, useEffect } from "react";
import Image from "next/image";
import { formatMoney, formatDealRound, dateToMonths } from "../utils/Utils";

function InvestmentsTable({ investmentsData }) {
  if (!investmentsData) {
    return <div>Loading</div>;
  }

  function TableHeader({ text, is_header = true }) {
    if (is_header) {
      return <th className=" px-4 py-2 text-center">{text}</th>;
    } else {
      return <td className="px-4 py-2 text-center">{text}</td>;
    }
  }

  const combinedData = [];

  // TODO: need some investment data from crunchbase to see the structure
  investmentsData.investments.forEach((investment) => {
    const wholeAmount = investment.funding_round_money_raised?.value_usd;

    combinedData.push({
      date: investment.announced_on,
      announced: dateToMonths(investment.announced_on),
      type: formatDealRound(investment.funding_round_investment_type),
      amount: wholeAmount ? "$" + formatMoney(wholeAmount) : "-",
      company: investment.organization_identifier?.value,
    });
  });

  investmentsData.acquisitions.forEach((acquisition) => {
    const wholeAmount = acquisition.price?.value_usd;

    combinedData.push({
      date: acquisition.announced_on.value,
      announced: dateToMonths(acquisition.announced_on.value),
      type: "Acquistion",
      amount: wholeAmount ? "$" + formatMoney(wholeAmount) : "-",
      company: acquisition.acquiree_identifier?.value,
    });
  });
  combinedData.sort((a, b) => new Date(b["date"]) - new Date(a["date"]));
  return (
    <div className="w-full max-h-36 overflow-auto bg-white rounded-md drop-shadow-sm">
      <table className="bg-white text-center text-sm w-full">
        <thead>
          <tr className="bg-primaryLight font-medium sticky top-0">
            <TableHeader text="Company" />
            <TableHeader text="Announced" />
            <TableHeader text="Type" />
            <TableHeader text="Amount" />
          </tr>
        </thead>
        <tbody>
          {combinedData.map((row, index) => (
            <tr key={index}>
              <TableHeader text={row.company} is_header={false} />
              <TableHeader text={row.announced} is_header={false} />
              <TableHeader text={row.type} is_header={false} />
              <TableHeader text={row.amount} is_header={false} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvestmentsTable;
