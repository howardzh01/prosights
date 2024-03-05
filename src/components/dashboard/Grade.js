import React from "react";
import {
  convertToChartData,
  convertToGrowthChartData,
  convertToChannelDoughnutData,
  convertToGeoDoughnutData,
  convertToAppUsageLoyaltyVsPeersData,
  convertToAppLoyaltyPeersLineData,
} from "../../utils/ChartUtils";
import { CHARTS } from "../../constants";
import { aggregateData } from "../../utils/Utils";

const Grade = ({
  headcountData,
  trafficData,
  webTrafficGeoData,
  multiCompanyAppData,
  companyName,
  cutOffDate = new Date("2019"),
}) => {
  //////////////////////////////////////////////
  //                                          //
  //                                          //
  // ALL CALCULATIONS FOR ASSET QUALITY GRADE //
  //                                          //
  //                                          //
  //////////////////////////////////////////////
  let usersAssetQuality = null;
  let organicWebTrafficQuality = null;
  let directWebTrafficQuality = null;
  let geographyWebTrafficQuality = null;
  let userTimeQuality = null;
  let m6RetentionQuality = null;

  // Calculation for users asset quality
  if (trafficData) {
    // Calculation for Users to Visits Ratio
    const visitsData = convertToGrowthChartData(
      aggregateData(trafficData, "visits", "sum", "year"),
      "Visits",
      cutOffDate,
      "K"
    );
    const usersData = convertToGrowthChartData(
      aggregateData(trafficData, "users", "sum", "year"),
      "Users",
      cutOffDate,
      "K"
    );
    const ltmUserCount =
      Number(
        usersData.chartData.datasets[0].data[
          usersData.chartData.datasets[0].data.length - 1
        ]
      ) || null;
    const ltmVisitsCount =
      Number(
        visitsData.chartData.datasets[0].data[
          visitsData.chartData.datasets[0].data.length - 1
        ]
      ) || null;
    const usersToVisitsRatio =
      ltmUserCount && ltmVisitsCount ? ltmUserCount / ltmVisitsCount : null;

    usersAssetQuality = usersToVisitsRatio
      ? usersToVisitsRatio >= 0.8
        ? 2
        : usersToVisitsRatio <= 0.5
        ? 0
        : 1
      : null;
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
    const ltmOrganicPercentage =
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
    const ltmDirectPercentage = visitsData.datasets[0].data[directIndex];

    directWebTrafficQuality =
      ltmDirectPercentage >= 50 ? 2 : ltmDirectPercentage <= 30 ? 0 : 1;
  }

  // Calculation for country web traffic quality
  if (webTrafficGeoData) {
    const geoData = convertToGeoDoughnutData(webTrafficGeoData, "traffic");

    // Finding the largest %
    const largestShare = Math.max(...geoData.datasets[0].data);

    geographyWebTrafficQuality =
      largestShare <= 50 ? 2 : largestShare >= 80 ? 0 : 1;
  }

  if (multiCompanyAppData) {
    const timeUsageData = convertToAppUsageLoyaltyVsPeersData(
      multiCompanyAppData,
      CHARTS.appLTMTimePerUser
    );

    const companyIndex = timeUsageData.labels.indexOf(companyName);
    const ltmTimeUsage =
      Number(timeUsageData.datasets[0].data[companyIndex]) || null;
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
    const ltmM6Retention =
      Number(retentionData.datasets[0].data[companyIndex]) || null;
    m6RetentionQuality = ltmM6Retention
      ? ltmM6Retention >= 25
        ? 2
        : ltmM6Retention <= 15
        ? 0
        : 1
      : null;
  }

  const netScore = [
    usersAssetQuality,
    organicWebTrafficQuality,
    directWebTrafficQuality,
    geographyWebTrafficQuality,
    userTimeQuality,
    m6RetentionQuality,
  ].reduce((acc, val) => acc + val, 0);
  const netScorePercentage = (netScore / 12) * 100;

  console.log("usersAssetQuality", usersAssetQuality);
  console.log("organicWebTrafficQuality", organicWebTrafficQuality);
  console.log("directWebTrafficQuality", directWebTrafficQuality);
  console.log("geographyWebTrafficQuality", geographyWebTrafficQuality);
  console.log("userTimeQuality", userTimeQuality);
  console.log("m6RetentionQuality", m6RetentionQuality);

  ///////////////////////////////////
  //                               //
  //                               //
  // ALL CALCULATIONS FOR MOMENTUM //
  //                               //
  //                               //
  ///////////////////////////////////
  let m6RetentionMomentum = null;
  let headcountMomentum = null;
  let trafficMomentum = null;
  let appDownloadsMomentum = null;
  let userTimeMomentum = null;

  // Calculation for M6 Retention Momentum
  if (multiCompanyAppData) {
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
      const yearPercentageChange =
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
        yearPercentageChange >= 0.1 ? 2 : yearPercentageChange <= -0.1 ? 0 : 1;
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
      const yearPercentageChange =
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
        yearPercentageChange >= 0.1 ? 2 : yearPercentageChange <= 0 ? 0 : 1;
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
      const yearPercentageChange =
        (visitsData.chartData.datasets[0].data[
          visitsData.chartData.datasets[0].data.length - 1
        ] -
          visitsData.chartData.datasets[0].data[index2019]) /
        visitsData.chartData.datasets[0].data[index2019];

      trafficMomentum =
        yearPercentageChange >= 1.5 ? 2 : yearPercentageChange <= 1 ? 0 : 1;
    }
  }

  // Calculation for app downloads momentum
  if (multiCompanyAppData) {
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
      const yearPercentageChange =
        (appDownloadsData.chartData.datasets[0].data[
          appDownloadsData.chartData.datasets[0].data.length - 1
        ] -
          appDownloadsData.chartData.datasets[0].data[index2019]) /
        appDownloadsData.chartData.datasets[0].data[index2019];

      appDownloadsMomentum =
        yearPercentageChange >= 1.5 ? 2 : yearPercentageChange <= 1 ? 0 : 1;
    }
  }

  // Calculation for user time momentum
  if (multiCompanyAppData) {
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
      const yearPercentageChange =
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
        yearPercentageChange >= 0.1 ? 2 : yearPercentageChange <= 0 ? 0 : 1;
    }
  }

  console.log("m6RetentionMomentum", m6RetentionMomentum);
  console.log("headcountMomentum", headcountMomentum);
  console.log("trafficMomentum", trafficMomentum);
  console.log("appDownloadsMomentum", appDownloadsMomentum);
  console.log("userTimeMomentum", userTimeMomentum);

  return <div></div>;
};

export default Grade;
