import React, { useState } from "react";
import CompetitorTags from "./CompetitorTags";
import CompetitorSearchButton from "./CompetitorSearchButton";
import SearchBar from "./SearchBar";
import Image from "next/image";

function CompetitorContainer({ companyCompetitors, setCompanyCompetitors }) {
  const handleDelete = (id) => {
    setCompanyCompetitors(companyCompetitors.filter((tag, ind) => ind !== id));
  };

  return (
    <div className="flex flex-wrap bg-white">
      {companyCompetitors.map((tag, index) => (
        <CompetitorTags
          key={index}
          label={tag}
          onDelete={() => handleDelete(index)}
        />
      ))}
      <div>
        <CompetitorSearchButton
          setCompanyCompetitors={setCompanyCompetitors}
        ></CompetitorSearchButton>
      </div>
      {/* <div
        className="flex flex-row items-center"
        onClick={() => setShowAutocomplete(true)}
      >
        <Image
          src="/assets/compare.svg"
          alt="Compare"
          className="w-4 h-4 mr-1 object-contain"
          width={128}
          height={128}
        />
        <p className="text-base text-customGray-500">Compare</p>
      </div> */}
    </div>
  );
}

export default CompetitorContainer;
