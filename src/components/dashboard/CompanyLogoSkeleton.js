import React from "react";

const CompanyLogoSkeleton = ({ companyDic, customTailwind = "" }) => {
  const colors = [
    "#FFD580", // Pastel Orange
    "#FFABAB", // Pastel Red
    "#FFC0CB", // Light Pink
    "#FF9CEE", // Pastel Purple
    "#B39DDB", // Light Pastel Purple
    "#9FA8DA", // Soft Blue
    "#90CAF9", // Light Blue
    "#80DEEA", // Light Cyan
    "#80CBC4", // Light Teal
    "#C5E1A5", // Light Green
  ];

  const stringToColor = (string) => {
    if (!string) return colors[0]; // Default color if string is empty
    const index = string.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const name = companyDic.displayedName;
  const getFirstLetter = (name) => {
    return name ? name.charAt(0) : "";
  };

  return (
    <div
      className={`${customTailwind} w-full h-full rounded-md flex items-center justify-center font-bold ${customTailwind}`}
      style={{
        backgroundColor: stringToColor(name),
      }}
    >
      {getFirstLetter(name)}
    </div>
  );
};

export default CompanyLogoSkeleton;
