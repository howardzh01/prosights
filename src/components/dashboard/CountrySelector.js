import React from "react";
import { COUNTRY_LIST } from "../../constants";

const CountrySelector = ({ country, setCountry }) => {
  return (
    <select
      className="h-10 text-customGray-500 rounded-md font-nunitoSans text-sm font-normal text-left focus:outline-none focus:ring-0"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
    >
      {Object.entries(COUNTRY_LIST).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
