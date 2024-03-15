import React, { useState, useEffect, useMemo } from "react";
import { INFO_HOVERS } from "../../../constants";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";

/*
Params format, which is almost the same as what is fed into the API call (just dataLoading is the added one):

{
    companyName,
    usersAssetQuality,
    mobilePercentage,
    organicWebTrafficQuality,
    ltmOrganicPercentage,
    directWebTrafficQuality,
    ltmDirectPercentage,
    geographyWebTrafficQuality,
    largestShare,
    userTimeQuality,
    ltmTimeUsage,
    m6RetentionQuality,
    ltmM6Retention,
    netAssetQualityScore,
    m6RetentionMomentum,
    retentionYearPercentageChange,
    headcountMomentum,
    headcountYearPercentageChange,
    trafficMomentum,
    trafficYearPercentageChange,
    appDownloadsMomentum,
    appYearPercentageChange,
    userTimeMomentum,
    usersYearPercentageChange,
    netMomentumScore,
    overallScore,
    dataLoading,
}
*/
const AISummary = (params) => {
  const [showStrengthsPopup, setShowStrengthsPopup] = useState(false);
  const [showWeaknessesPopup, setShowWeaknessesPopup] = useState(false);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const fetchSummaryData = async () => {
    const response = await fetch(`/api/private/getSmartSummaryResults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    /*
    Response format should be:     
    
    {
        strengths: [
            {
            header: String,
            text: String,
            },
            ... 5 total objects, representing 5 strengths
        ],
        weaknesses: [
            {
            header: String,
            text: String,
            },
            ... 5 total objects, representing 5 weaknesses
        ],
    }
    */

    const data = await response.json();
    setSummaryLoading(false);
    setStrengths(data.strengths);
    setWeaknesses(data.weaknesses);
  };

  useEffect(() => {
    if (!params.dataLoading) {
      setSummaryLoading(true);
      fetchSummaryData();
    }
  }, [params.dataLoading]);

  useEffect(() => {
    setStrengths([]);
    setWeaknesses([]);
    setSummaryLoading(true);
  }, [params.companyName]);

  return (
    <div className="w-10/12 flex flex-row space-x-8 text-customGray-800">
      <div className="flex flex-col space-y-4 w-1/2">
        <div className="flex flex-row items-center relative">
          <p className="font-semibold text-lg text-customGray-800 mr-2">
            Strengths
          </p>
          {/* <div
            className="group cursor-pointer"
            onMouseOver={() => setShowStrengthsPopup(true)}
            onMouseOut={() => setShowStrengthsPopup(false)}
          >
            <Image
              src="/assets/info.svg"
              alt="info"
              width={128}
              height={128}
              className="w-4"
            />
          </div>
          <div
            id="infoPopup"
            className="absolute block bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 text-xs z-50"
            style={{
              display: showStrengthsPopup ? "block" : "none",
            }}
          >
            {INFO_HOVERS.SUMMARY.ABOUT}
          </div> */}
        </div>
        {params.dataLoading || summaryLoading ? (
          <div className="flex flex-col">
            <p className="text-sm text-customGray-300 italic mb-3">
              This can take up to a minute to load...
            </p>
            <Skeleton className="w-full h-64 rounded-lg bg-customGray-50" />
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {strengths.map((strength) => (
              <li key={strength.header} className="text-sm leading-relaxed">
                <strong className="font-semibold">{strength.header}: </strong>
                {strength.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col space-y-4 w-1/2">
        <div className="flex flex-row items-center relative">
          <p className="font-semibold text-lg text-customGray-800 mr-2">
            Weaknesses
          </p>
          {/* <div
            className="group cursor-pointer"
            onMouseOver={() => setShowWeaknessesPopup(true)}
            onMouseOut={() => setShowWeaknessesPopup(false)}
          >
            <Image
              src="/assets/info.svg"
              alt="info"
              width={128}
              height={128}
              className="w-4"
            />
          </div>
          <div
            id="infoPopup"
            className="absolute block bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 text-xs z-50"
            style={{
              display: showWeaknessesPopup ? "block" : "none",
            }}
          >
            {INFO_HOVERS.SUMMARY.ABOUT}
          </div> */}
        </div>
        {params.dataLoading || summaryLoading ? (
          <div className="flex flex-col">
            <p className="text-sm text-customGray-300 italic mb-3">
              This can take up to a minute to load...
            </p>
            <Skeleton className="w-full h-64 rounded-lg bg-customGray-50" />
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {weaknesses.map((weakness) => (
              <li key={weakness.header} className="text-sm leading-relaxed">
                <strong className="font-semibold">{weakness.header}: </strong>
                {weakness.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AISummary;
