import { useState, useEffect } from "react";
import Image from "next/image";

function InvestmentsTable({ investmentsData }) {
  console.log(investmentsData);
  if (!investmentsData) {
    return <div>Loading</div>;
  }

  function TableHeader({ text, is_header = true }) {
    if (is_header) {
      return <th className="border px-2 py-1 text-center">{text}</th>;
    } else {
      return <td className="border px-2 py-1 text-center">{text}</td>;
    }
  }

  const combinedData = [];

  // TODO: need some investment data from crunchbase to see the structure
  investmentsData.investments.forEach((investment) => {
    combinedData.push({
      // date: investment.,
      // type: investment.,
      // amount: investment.,
      // valuation: investment.
    });
  });

  investmentsData.acquisitions.forEach((acquisition) => {
    const wholeAmount = acquisition.acquirer_funding_total.value_usd;

    combinedData.push({
      date: acquisition.announced_on.value,
      type: acquisition.acquisition_type,
      amount:
        wholeAmount !== 0
          ? // check if money raised > 1 billion and if not then just use millions
            `$${
              wholeAmount > 1000000000
                ? wholeAmount / 1000000000
                : wholeAmount / 1000000
            }${wholeAmount > 1000000000 ? "B" : "M"}`
          : "-",
      valuation: "_", // TODO: not sure if this data is returned for acquisitions
    });
  });

  return (
    <div className="w-full overflow-auto">
      <table className="bg-white text-sm w-full">
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
              <TableHeader text={row.date} is_header={false} />
              <TableHeader text={row.type} is_header={false} />
              <TableHeader text={row.amount} is_header={false} />
              <TableHeader text={row.valuation} is_header={false} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvestmentsTable;
