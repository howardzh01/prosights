import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import HeadCountChart from "../components/charts/HeadCountChart";
import WebTrafficChart from "../components/charts/WebTrafficChart";
import SearchBoxDashboard from "../components/SearchBoxDashboard";
import WebGeoTrafficChart from "../components/charts/WebGeoTrafficChart";

function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [company, setCompany] = useState("stockx");
  const [country, setCountry] = useState("US");
  const regions = {
    global: "Global",
    US: "United States",
    AU: "Australia",
    CA: "Canada",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    NL: "Netherlands",
    PL: "Poland",
    ES: "Spain",
    SE: "Sweden",
    GB: "United Kingdom",
  };
  // stockx, goat, grailed, flight-club,
  //   const company = "zillow";
  return (
    <div>
      <div className="mx-12 my-12 w-1/2 space-y-8">
        <SearchBoxDashboard setCompany={setCompany}></SearchBoxDashboard>

        <div className="text-4xl font-bold">
          {company + ".com"} for {country}
        </div>

        {user && company ? (
          <HeadCountChart user={user} companyName={company} />
        ) : (
          <p>loading</p>
        )}

        {user && company ? (
          <WebTrafficChart
            user={user}
            companyUrl={company + ".com"}
            country={country}
          />
        ) : (
          <p>loading</p>
        )}

        {user && company ? (
          <WebGeoTrafficChart
            user={user}
            companyUrl={company + ".com"}
            country={country}
          />
        ) : (
          <p>loading</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
