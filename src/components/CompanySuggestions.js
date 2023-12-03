import Link from "next/link";
import Image from "next/image";
import React from "react";
import CompanySuggestionButton from "./CompanySuggestionButton";

function CompanySuggestions() {
  const suggestions = [
    "Spotify",
    "Netflix",
    "ESPN",
    "Hopper",
    "MyFitnessPal",
    "Y-Combinator",
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {suggestions.slice(0, 6).map((companyName, index) => (
        <CompanySuggestionButton companyName={companyName} />
      ))}
    </div>
  );
}

export default CompanySuggestions;
