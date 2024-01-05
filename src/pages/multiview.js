import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import HeadCountChart from "../components/charts/HeadCountChart";
import WebTrafficChart from "../components/charts/WebTrafficChart";
import WebGeoTrafficChart from "../components/charts/WebGeoTrafficChart";

function CacheCompanies() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  //   const [company, setCompany] = useState("stockx");
  const [country, setCountry] = useState("US");
  const companyUrls = [
    "stockx.com",
    "goat.com",
    "grailed.com",
    "flightclub.com",
    "stadiumgoods.com",
    "zillow.com",
    "realtor.com",
    "redfin.com",
    "trulia.com",
    "streeteasy.com",
    "openai.com",
    "anthropic.com",
    "stability.ai",
    "deepmind.com",
    "mistral.ai",
  ];
  // stockx, goat, grailed, flight-club,
  //   const company = "zillow";
  return (
    <div>
      {companyUrls.map((companyUrl, index) => (
        <div key={index} className="mx-12 my-12 w-1/2 space-y-8">
          {/* <SearchBoxDashboard setCompany={setCompany}></SearchBoxDashboard> */}

          <div className="text-4xl font-bold">{companyUrl}</div>

          {/* {user && company ? (
          <HeadCountChart user={user} companyName={company} />
        ) : (
          <p>loading</p>
        )} */}

          {/* {user && companyUrl ? (
            <WebTrafficChart
              user={user}
              companyUrl={companyUrl}
              country={country}
            />
          ) : (
            <p>loading</p>
          )} */}

          {user && companyUrl ? (
            <WebGeoTrafficChart
              user={user}
              companyUrl={companyUrl}
              country={country}
            />
          ) : (
            <p>loading</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default CacheCompanies;
