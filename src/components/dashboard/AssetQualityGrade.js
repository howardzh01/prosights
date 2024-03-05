import React from "react";
import {
  convertToGrowthChartData,
  convertToChannelDoughnutData,
  convertToGeoDoughnutData,
  convertToAppUsageLoyaltyVsPeersData,
} from "../../utils/ChartUtils";
import { CHARTS } from "../../constants";
import { aggregateData } from "../../utils/Utils";

const AssetQualityGrade = ({
  trafficData,
  webTrafficGeoData,
  multiCompanyAppData,
  companyName,
  cutOffDate = new Date("2019"),
}) => {
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

  return <div></div>;
};

export default AssetQualityGrade;
