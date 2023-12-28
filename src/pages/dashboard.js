import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import HeadCountChart from "../components/charts/HeadCountChart";
import WebTrafficChart from "../components/charts/WebTrafficChart";

function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  //   const [company, setCompany] = useState(null);

  // stockx, goat, grailed, flight-club,
  const company = "grailed";
  return (
    <div className="mx-12 my-12 w-1/2 space-y-8">
      <div className="text-4xl font-bold">{company + ".com"}</div>

      {user && company ? (
        <HeadCountChart user={user} companyName={company} />
      ) : (
        <p>loading</p>
      )}

      {user && company ? (
        <WebTrafficChart user={user} companyName={company + ".com"} />
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}

export default Dashboard;
