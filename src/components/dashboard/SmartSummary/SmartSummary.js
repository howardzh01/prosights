import React from "react";
import Grade from "./Grade";
import AISummary from "./AISummary";
import {
  convertToChartData,
  convertToGrowthChartData,
  convertToChannelDoughnutData,
  convertToGeoDoughnutData,
  convertToAppUsageLoyaltyVsPeersData,
  convertToAppLoyaltyPeersLineData,
} from "../../../utils/ChartUtils";
import { CHARTS } from "../../../constants";
import { aggregateData } from "../../../utils/Utils";

const SmartSummary = ({
  headcountData,
  trafficData,
  webTrafficGeoData,
  multiCompanyAppData,
  companyName,
  cutOffDate = new Date("2019"),
}) => {
  // Loading states for the data variables
  const headCountDataLoading = headcountData === undefined;
  const trafficDataLoading = trafficData === undefined;
  const webTrafficGeoDataLoading = webTrafficGeoData === undefined;
  const multiCompanyAppDataLoading =
    multiCompanyAppData === undefined ||
    multiCompanyAppData[companyName] === undefined;
  const dataLoading =
    headCountDataLoading ||
    trafficDataLoading ||
    webTrafficGeoDataLoading ||
    multiCompanyAppDataLoading;

  //////////////////////////////////////////////
  //                                          //
  //                                          //
  // ALL CALCULATIONS FOR ASSET QUALITY GRADE //
  //                                          //
  //                                          //
  //////////////////////////////////////////////
  let usersAssetQuality = null;
  let mobilePercentage = null;
  let organicWebTrafficQuality = null;
  let ltmOrganicPercentage = null;
  let directWebTrafficQuality = null;
  let ltmDirectPercentage = null;
  let geographyWebTrafficQuality = null;
  let largestShare = null;
  let userTimeQuality = null;
  let ltmTimeUsage = null;
  let m6RetentionQuality = null;
  let ltmM6Retention = null;

  // Calculation for users asset quality
  if (trafficData) {
    // Calculation for percent that are mobile
    const visitsData = convertToChannelDoughnutData(
      trafficData,
      "traffic_by_device"
    );

    const mobileIndex = visitsData.labels.indexOf("Mobile Visits");
    mobilePercentage = visitsData.datasets[0].data[mobileIndex];
    usersAssetQuality =
      mobilePercentage >= 40 ? 2 : mobilePercentage <= 20 ? 0 : 1;
  }

  // Calculation for organic web traffic quality
  if (trafficData) {
    const visitsData = convertToChannelDoughnutData(
      trafficData,
      "traffic_by_channel"
    );

    const organicSearchIndex = visitsData.labels.indexOf("Organic Search");
    const organicSocialIndex = visitsData.labels.indexOf("Organic Social");
    const directIndex = visitsData.labels.indexOf("Direct");
    const mailIndex = visitsData.labels.indexOf("Mail");
    ltmOrganicPercentage =
      visitsData.datasets[0].data[organicSearchIndex] +
      visitsData.datasets[0].data[organicSocialIndex] +
      visitsData.datasets[0].data[mailIndex] +
      visitsData.datasets[0].data[directIndex];

    organicWebTrafficQuality =
      ltmOrganicPercentage >= 80 ? 2 : ltmOrganicPercentage <= 50 ? 0 : 1;
  }

  // Calculation for direct web traffic quality
  if (trafficData) {
    const visitsData = convertToChannelDoughnutData(
      trafficData,
      "traffic_by_channel"
    );

    const directIndex = visitsData.labels.indexOf("Direct");
    ltmDirectPercentage = visitsData.datasets[0].data[directIndex];

    directWebTrafficQuality =
      ltmDirectPercentage >= 50 ? 2 : ltmDirectPercentage <= 30 ? 0 : 1;
  }

  // Calculation for country web traffic quality
  if (webTrafficGeoData) {
    const geoData = convertToGeoDoughnutData(webTrafficGeoData, "traffic");

    // Finding the largest %
    largestShare = Math.max(...geoData.datasets[0].data);

    geographyWebTrafficQuality =
      largestShare <= 50 ? 2 : largestShare >= 80 ? 0 : 1;
  }

  if (multiCompanyAppData && multiCompanyAppData[companyName]) {
    const timeUsageData = convertToAppUsageLoyaltyVsPeersData(
      multiCompanyAppData,
      CHARTS.appLTMTimePerUser
    );

    const companyIndex = timeUsageData.labels.indexOf(companyName);
    ltmTimeUsage = Number(timeUsageData.datasets[0].data[companyIndex]) || null;
    userTimeQuality = ltmTimeUsage
      ? ltmTimeUsage >= 30
        ? 2
        : ltmTimeUsage <= 10
        ? 0
        : 1
      : null;
  }

  if (multiCompanyAppData) {
    const retentionData = convertToAppUsageLoyaltyVsPeersData(
      multiCompanyAppData,
      CHARTS.appLTMRetentionM6
    );

    const companyIndex = retentionData.labels.indexOf(companyName);
    ltmM6Retention =
      Number(retentionData.datasets[0].data[companyIndex]) || null;
    m6RetentionQuality = ltmM6Retention
      ? ltmM6Retention >= 25
        ? 2
        : ltmM6Retention <= 15
        ? 0
        : 1
      : null;
  }

  // console.log("usersAssetQuality", usersAssetQuality);
  // console.log("organicWebTrafficQuality", organicWebTrafficQuality);
  // console.log("directWebTrafficQuality", directWebTrafficQuality);
  // console.log("geographyWebTrafficQuality", geographyWebTrafficQuality);
  // console.log("userTimeQuality", userTimeQuality);
  // console.log("m6RetentionQuality", m6RetentionQuality);

  ///////////////////////////////////
  //                               //
  //                               //
  // ALL CALCULATIONS FOR MOMENTUM //
  //                               //
  //                               //
  ///////////////////////////////////
  let m6RetentionMomentum = null;
  let retentionYearPercentageChange = null;
  let headcountMomentum = null;
  let headcountYearPercentageChange = null;
  let trafficMomentum = null;
  let trafficYearPercentageChange = null;
  let appDownloadsMomentum = null;
  let appYearPercentageChange = null;
  let userTimeMomentum = null;
  let usersYearPercentageChange = null;

  // Calculation for M6 Retention Momentum
  if (multiCompanyAppData && multiCompanyAppData[companyName]) {
    const m6RetentionData = convertToAppLoyaltyPeersLineData(
      multiCompanyAppData,
      "year",
      cutOffDate,
      CHARTS.appLTMRetentionM6,
      false
    );

    const companyIndex = m6RetentionData.chartData.datasets.findIndex(
      (dataset) => dataset.label === companyName
    );

    // Year percentage change from last year to this year
    // If either this year or last year's data is null, then the result is null
    if (
      m6RetentionData.chartData.datasets[companyIndex].data[
        m6RetentionData.chartData.datasets[companyIndex].data.length - 1
      ] &&
      m6RetentionData.chartData.datasets[companyIndex].data[
        m6RetentionData.chartData.datasets[companyIndex].data.length - 2
      ]
    ) {
      retentionYearPercentageChange =
        (m6RetentionData.chartData.datasets[companyIndex].data[
          m6RetentionData.chartData.datasets[companyIndex].data.length - 1
        ] -
          m6RetentionData.chartData.datasets[companyIndex].data[
            m6RetentionData.chartData.datasets[companyIndex].data.length - 2
          ]) /
        m6RetentionData.chartData.datasets[companyIndex].data[
          m6RetentionData.chartData.datasets[companyIndex].data.length - 2
        ];
      m6RetentionMomentum =
        retentionYearPercentageChange >= 0.1
          ? 2
          : retentionYearPercentageChange <= -0.1
          ? 0
          : 1;
    }
  }

  // Calculation for headcount momentum
  if (headcountData) {
    const headcountYearData = convertToChartData(
      aggregateData(headcountData, "headcount", "last", "year"),
      cutOffDate
    );

    // Headcount percentage change from last year to this year
    // If either this or last year's data is null, then the result is null
    if (
      headcountYearData.datasets[0].data[
        headcountYearData.datasets[0].data.length - 1
      ] &&
      headcountYearData.datasets[0].data[
        headcountYearData.datasets[0].data.length - 2
      ]
    ) {
      headcountYearPercentageChange =
        (headcountYearData.datasets[0].data[
          headcountYearData.datasets[0].data.length - 1
        ] -
          headcountYearData.datasets[0].data[
            headcountYearData.datasets[0].data.length - 2
          ]) /
        headcountYearData.datasets[0].data[
          headcountYearData.datasets[0].data.length - 2
        ];

      headcountMomentum =
        headcountYearPercentageChange >= 0.1
          ? 2
          : headcountYearPercentageChange <= 0
          ? 0
          : 1;
    }
  }

  // Calculation for web traffic momentum
  if (trafficData) {
    const visitsData = convertToGrowthChartData(
      aggregateData(trafficData, "visits", "sum", "year"),
      "Visits",
      cutOffDate,
      "K"
    );

    // Percentage change from this year to 2019
    // If either this or 2019's data is null, then the result is null
    const index2019 = visitsData.chartData.labels.indexOf("2019");
    if (
      visitsData.chartData.datasets[0].data[
        visitsData.chartData.datasets[0].data.length - 1
      ] &&
      visitsData.chartData.datasets[0].data[index2019]
    ) {
      trafficYearPercentageChange =
        (visitsData.chartData.datasets[0].data[
          visitsData.chartData.datasets[0].data.length - 1
        ] -
          visitsData.chartData.datasets[0].data[index2019]) /
        visitsData.chartData.datasets[0].data[index2019];

      trafficMomentum =
        trafficYearPercentageChange >= 1.5
          ? 2
          : trafficYearPercentageChange <= 1
          ? 0
          : 1;
    }
  }

  // Calculation for app downloads momentum
  if (multiCompanyAppData && multiCompanyAppData[companyName]) {
    const appDownloadsData = convertToGrowthChartData(
      aggregateData(
        multiCompanyAppData[companyName]["app_performance"],
        "est_download",
        "sum",
        "year"
      ),
      "App Downloads",
      cutOffDate,
      "K"
    );

    // Percentage change from this year to 2019
    // If either this or 2019's data is null, then the result is null
    const index2019 = appDownloadsData.chartData.labels.indexOf("2019");
    if (
      appDownloadsData.chartData.datasets[0].data[
        appDownloadsData.chartData.datasets[0].data.length - 1
      ] &&
      appDownloadsData.chartData.datasets[0].data[index2019]
    ) {
      appYearPercentageChange =
        (appDownloadsData.chartData.datasets[0].data[
          appDownloadsData.chartData.datasets[0].data.length - 1
        ] -
          appDownloadsData.chartData.datasets[0].data[index2019]) /
        appDownloadsData.chartData.datasets[0].data[index2019];

      appDownloadsMomentum =
        appYearPercentageChange >= 1.5
          ? 2
          : appYearPercentageChange <= 1
          ? 0
          : 1;
    }
  }

  // Calculation for user time momentum
  if (multiCompanyAppData && multiCompanyAppData[companyName]) {
    const timeUsageData = convertToAppLoyaltyPeersLineData(
      multiCompanyAppData,
      "year",
      cutOffDate,
      CHARTS.appLTMTimePerUser,
      false
    );

    // User time percentage change from last year to this year
    // If either this or last year's data is null, then the result is null
    const companyIndex = timeUsageData.chartData.datasets.findIndex(
      (dataset) => dataset.label === companyName
    );
    if (
      timeUsageData.chartData.datasets[companyIndex].rawData[
        timeUsageData.chartData.datasets[companyIndex].rawData.length - 1
      ] &&
      timeUsageData.chartData.datasets[companyIndex].rawData[
        timeUsageData.chartData.datasets[companyIndex].rawData.length - 2
      ]
    ) {
      usersYearPercentageChange =
        (timeUsageData.chartData.datasets[companyIndex].rawData[
          timeUsageData.chartData.datasets[companyIndex].rawData.length - 1
        ] -
          timeUsageData.chartData.datasets[companyIndex].rawData[
            timeUsageData.chartData.datasets[companyIndex].rawData.length - 2
          ]) /
        timeUsageData.chartData.datasets[companyIndex].rawData[
          timeUsageData.chartData.datasets[companyIndex].rawData.length - 2
        ];

      userTimeMomentum =
        usersYearPercentageChange >= 0.1
          ? 2
          : usersYearPercentageChange <= 0
          ? 0
          : 1;
    }
  }

  // console.log("m6RetentionMomentum", m6RetentionMomentum);
  // console.log("headcountMomentum", headcountMomentum);
  // console.log("trafficMomentum", trafficMomentum);
  // console.log("appDownloadsMomentum", appDownloadsMomentum);
  // console.log("userTimeMomentum", userTimeMomentum);

  /////////////////////////////////////
  //                                 //
  //                                 //
  // ALL CALCULATIONS FOR NET SCORES //
  //                                 //
  //                                 //
  /////////////////////////////////////
  // Calculating net asset quality score
  const qualityScores = [
    usersAssetQuality,
    organicWebTrafficQuality,
    directWebTrafficQuality,
    geographyWebTrafficQuality,
    userTimeQuality,
    m6RetentionQuality,
  ];

  const validScores = qualityScores.filter((val) => val !== null);
  const netAssetQualityScore =
    (validScores.reduce((acc, val) => acc + val, 0) /
      (2 * validScores.length)) *
    100;

  // Calculating net momentum score
  const momentumScores = [
    m6RetentionMomentum,
    headcountMomentum,
    trafficMomentum,
    appDownloadsMomentum,
    userTimeMomentum,
  ];
  const validMomentumScores = momentumScores.filter((val) => val !== null);
  const netMomentumScore =
    (validMomentumScores.reduce((acc, val) => acc + val, 0) /
      (2 * validMomentumScores.length)) *
    100;

  const overallScore = (netAssetQualityScore + netMomentumScore) / 2;

  // console.log("netAssetQualityScore", netAssetQualityScore);
  // console.log("netMomentumScore", netMomentumScore);
  // console.log("Overall grade", overallScore);

  return (
    <div className="flex flex-row w-full justify-center space-x-12 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-25 border border-customGray-50 py-6 mt-4">
      <Grade
        overallScore={overallScore}
        netAssetQualityScore={netAssetQualityScore}
        netMomentumScore={netMomentumScore}
        dataLoading={dataLoading}
      />
      <AISummary
        companyName={companyName}
        usersAssetQuality={usersAssetQuality}
        mobilePercentage={Math.round(mobilePercentage)}
        organicWebTrafficQuality={organicWebTrafficQuality}
        ltmOrganicPercentage={Math.round(ltmOrganicPercentage)}
        directWebTrafficQuality={directWebTrafficQuality}
        ltmDirectPercentage={Math.round(ltmDirectPercentage)}
        geographyWebTrafficQuality={geographyWebTrafficQuality}
        largestShare={Math.round(largestShare)}
        userTimeQuality={userTimeQuality}
        ltmTimeUsage={Math.round(ltmTimeUsage)}
        m6RetentionQuality={m6RetentionQuality}
        ltmM6Retention={Math.round(ltmM6Retention)}
        netAssetQualityScore={netAssetQualityScore}
        m6RetentionMomentum={m6RetentionMomentum}
        retentionYearPercentageChange={Math.round(
          retentionYearPercentageChange
        )}
        headcountMomentum={headcountMomentum}
        headcountYearPercentageChange={Math.round(
          headcountYearPercentageChange
        )}
        trafficMomentum={trafficMomentum}
        trafficYearPercentageChange={Math.round(trafficYearPercentageChange)}
        appDownloadsMomentum={appDownloadsMomentum}
        appYearPercentageChange={Math.round(appYearPercentageChange)}
        userTimeMomentum={userTimeMomentum}
        usersYearPercentageChange={Math.round(usersYearPercentageChange)}
        netMomentumScore={netMomentumScore}
        overallScore={overallScore}
        dataLoading={dataLoading}
      />
    </div>
  );
};

export default SmartSummary;
