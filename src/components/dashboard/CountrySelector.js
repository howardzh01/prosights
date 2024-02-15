import React from "react";

const countryList = {
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  CN: "China",
  KR: "South Korea",
  JP: "Japan",
  IN: "India",
  GB: "United Kingdom",
  FR: "France",
  IT: "Italy",
  DE: "Germany",
  ES: "Spain",
};

const CountrySelector = ({ country, setCountry }) => {
  return (
    <select
      className="h-10 text-customGray-500 rounded-md font-nunitoSans text-sm font-normal text-left focus:outline-none focus:ring-0 ml-6"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
    >
      {Object.entries(countryList).map(([code, name]) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
