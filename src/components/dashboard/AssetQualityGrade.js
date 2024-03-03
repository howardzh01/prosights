import React from "react";
import {
  convertToGrowthChartData,
  convertToChannelDoughnutData,
  convertToGeoDoughnutData,
} from "../../utils/ChartUtils";
import { aggregateData } from "../../utils/Utils";

const AssetQualityGrade = ({
  trafficData,
  geoTrafficData,
  cutOffDate = new Date("2019"),
}) => {
  let usersAssetQuality = null;
  let organicWebTrafficQuality = null;
  let directWebTrafficQuality = null;
  let internationalWebTrafficQuality = null;

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
    const ltmOrganicPercentage =
      visitsData.datasets[0].data[organicSearchIndex] +
      visitsData.datasets[0].data[organicSocialIndex];

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

  // Calculation for outside US web traffic quality
  if (geoTrafficData) {
    const geoData = convertToGeoDoughnutData(geoTrafficData, "traffic");

    const northAmericaIndex = geoData.labels.indexOf("North America");
    const ltmOutsideNorthAmericaPercentage =
      1 - geoData.datasets[0].data[northAmericaIndex];

    internationalWebTrafficQuality =
      ltmOutsideNorthAmericaPercentage >= 50
        ? 2
        : ltmOutsideNorthAmericaPercentage <= 20
        ? 0
        : 1;
  }

  console.log("usersAssetQuality", usersAssetQuality);
  console.log("organicWebTrafficQuality", organicWebTrafficQuality);
  console.log("directWebTrafficQuality", directWebTrafficQuality);
  console.log("internationalWebTrafficQuality", internationalWebTrafficQuality);

  return <div></div>;
};

export default AssetQualityGrade;
