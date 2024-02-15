import React from "react";

const CountrySelector = ({ setCountry }) => {
  return (
    <select
      className="h-10 text-customGray-500 rounded-md font-nunitoSans text-sm font-normal text-left focus:outline-none focus:ring-0 ml-6"
      onChange={(e) => setCountry(e.target.value)}
    >
      <option value="us">US</option>
      <option value="asia">Asia</option>
    </select>
  );
};

export default CountrySelector;
