import React, { useState } from "react";
import CompetitorSearchBar from "./CompetitorSearchBar";

function CompetitorContainer({
  targetCompany,
  emptyStateCompanyList,
  companyCompetitors,
  setCompanyCompetitors,
}) {
  const handleDelete = (id) => {
    setCompanyCompetitors(companyCompetitors.filter((tag, ind) => ind !== id));
  };

  return (
    <div className="flex flex-wrap bg-white">
      {/* {companyCompetitors.map((tag, index) => (
        <CompetitorTags
          key={index}
          label={tag}
          onDelete={() => handleDelete(index)}
        />
      ))} */}
      <div className="flex flex-end w-300 mr-4">
        <CompetitorSearchBar
          targetCompany={targetCompany}
          emptyStateCompanyList={emptyStateCompanyList}
          companyCompetitors={companyCompetitors}
          setCompanyCompetitors={setCompanyCompetitors}
        ></CompetitorSearchBar>
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
