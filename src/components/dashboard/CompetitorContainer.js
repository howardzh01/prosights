import React, { useState } from "react";
import CompetitorTags from "./CompetitorTags";
import Image from "next/image";

const CompetitorContainer = () => {
  const [tags, setTags] = useState([
    { id: 1, name: "StockX" },
    { id: 2, name: "GOAT" },
    { id: 3, name: "Grailed" },
    { id: 4, name: "Flightclub" },
  ]);

  const handleDelete = (id) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex flex-wrap">
      {tags.map((tag) => (
        <CompetitorTags
          key={tag.id}
          label={tag.name}
          onDelete={() => handleDelete(tag.id)}
        />
      ))}
      <div className="flex flex-row items-center">
        <Image
          src="/assets/compare.svg"
          alt="Compare"
          className="w-4 h-4 mr-1 object-contain"
          width={128}
          height={128}
        />
        <p className="text-base text-customGray-500">Compare</p>
      </div>
    </div>
  );
};

export default CompetitorContainer;
