import Link from "next/link";
import Image from "next/image";
import React from "react";

function CompanySuggestionButton({ companyName }) {
  return (
    <div className="text-center text-sm md:text-base bg-white rounded-lg border border-b-gray-200 py-2 px-2 md:px-6 text-gray-800">
      {companyName}
    </div>
  );
}

export default CompanySuggestionButton;
