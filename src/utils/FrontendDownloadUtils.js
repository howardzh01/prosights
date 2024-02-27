import {
  convertHeadCountChartDataToExcelFormat,
  convertTotalVisitsChartDataToExcelFormat,
  convertWebUsersChartDataToExcelFormat,
  convertBreakdownChartDataToExcelFormat,
  convertTrafficByChannelChartDataToExcelFormat,
  convertTrafficGrowthVsPeersChartDataToExcelFormat,
  convertTrafficMarketShareVsPeersDataToExcelFormat,
  convertTrafficBreakdownVsPeersDataToExcelFormat,
  convertAppUsersChartDataToExcelFormat,
  convertAppUsageGrowthVsPeersChartDataToExcelFormat,
  convertAppUsageMarketShareVsPeersDataToExcelFormat,
  convertAppUsageLoyalUsersVsPeersDataToExcelFormat,
} from "./ChartUtils";
import { getApiData, getExcelDownload } from "../api";

// Downloading Utils
export const downloadPDF = async (pdfName = "PDF_download") => {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  // Scroll to the top of the page to ensure the content starts from the very beginning
  window.scrollTo(0, 0);

  const element = document.getElementById("main-content");
  const contentWidth = element.scrollWidth * 1.3; // Full scrollable content width, hardcoded 1.3x
  const contentHeight = element.scrollHeight; // Full scrollable content height

  // Create a canvas with the full content
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: window.devicePixelRatio, // Use the device pixel ratio for better resolution
    logging: true,
    dpi: 192,
    letterRendering: true,
    scrollX: 0,
    scrollY: 0,
    width: contentWidth,
    height: contentHeight,
    windowHeight: contentHeight,
    windowWidth: contentWidth,
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);

  // Calculate the PDF width and height in points (1 point = 1/72 inch)
  const pdfWidth = 595.28; // A4 width in points at 72 DPI
  const pdfHeight = (pdfWidth * contentHeight) / contentWidth; // Calculate the height based on the content aspect ratio

  // Calculate the ratio to fit the content within the A4 dimensions
  const ratio = Math.min(pdfWidth / contentWidth, pdfHeight / contentHeight);

  // Calculate the dimensions of the image on the PDF
  const imgWidth = contentWidth * ratio;
  const imgHeight = contentHeight * ratio;

  // Calculate the position to center the content
  const xPosition = (pdfWidth - imgWidth) / 2;
  const yPosition = (pdfHeight - imgHeight) / 2;

  // Create a PDF with a custom page size that matches the content's aspect ratio
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [pdfWidth, pdfHeight],
  });

  // Add the image to the PDF centered
  pdf.addImage(imgData, "JPEG", xPosition, yPosition, pdfWidth, pdfHeight);
  pdf.save(pdfName);
};

export function downloadExcelBuilder(
  headCountData,
  webTrafficData,
  webTrafficGeoData,
  dataAIData,
  companyDic,
  dataCutoffDate,
  country,
  name,
  devMode = false
) {
  // Excel sheet builder
  const headcountSectionBuilder =
    headCountData && headCountData?.[companyDic.displayedName]
      ? [
          {
            type: "bar",
            sheetName: "Headcount",
            sheetTabColor: "#D7ECFB",
            req: convertHeadCountChartDataToExcelFormat(
              headCountData[companyDic.displayedName],
              dataCutoffDate
            ),
            poweredBy: "Coresignal",
          },
        ]
      : [];
  const webTrafficSectionBuilder = [
    webTrafficData?.[companyDic.displayedName] !== undefined &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length != 0
      ? {
          type: "bar",
          sheetName: "Traffic Total Visits",
          sheetTabColor: "#808080",
          req: convertTotalVisitsChartDataToExcelFormat(
            webTrafficData[companyDic.displayedName],
            dataCutoffDate
          ),
          poweredBy: "Semrush",
          showDataLabels: false,
        }
      : null,
    webTrafficData?.[companyDic.displayedName] !== undefined &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length != 0
      ? {
          type: "bar",
          sheetName: "Traffic Web Users",
          sheetTabColor: "#808080",
          req: convertWebUsersChartDataToExcelFormat(
            webTrafficData[companyDic.displayedName],
            dataCutoffDate
          ),
          poweredBy: "Semrush",
          showDataLabels: false,
        }
      : null,
    // TODO: Need to split cases on geo and non-geo data
    webTrafficGeoData?.[companyDic.displayedName] !== undefined &&
    webTrafficGeoData?.[companyDic.displayedName] !== null &&
    Object.keys(webTrafficGeoData?.[companyDic.displayedName]).length !== 0 &&
    webTrafficData?.[companyDic.displayedName] !== undefined &&
    webTrafficData?.[companyDic.displayedName] !== null &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
      ? {
          type: "doughnut",
          sheetName: "Traffic Breakdown",
          sheetTabColor: "#808080",
          req: convertBreakdownChartDataToExcelFormat(
            webTrafficGeoData[companyDic.displayedName],
            webTrafficData[companyDic.displayedName]
          ),
          poweredBy: "Semrush",
        }
      : null,
    webTrafficData?.[companyDic.displayedName] !== undefined &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
      ? {
          type: "stacked",
          sheetName: "Traffic Total Visits by Channel",
          sheetTabColor: "#808080",
          req: convertTrafficByChannelChartDataToExcelFormat(
            webTrafficData[companyDic.displayedName],
            dataCutoffDate
          ),
          poweredBy: "Semrush",
        }
      : null,
    webTrafficData !== undefined &&
    Object.keys(webTrafficData).length != 0 &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
      ? {
          type: "line",
          sheetName: "Traffic Growth vs. Peers",
          sheetTabColor: "#808080",
          req: convertTrafficGrowthVsPeersChartDataToExcelFormat(
            webTrafficData,
            dataCutoffDate
          ),
          poweredBy: "Semrush",
        }
      : null,
    webTrafficData !== undefined &&
    Object.keys(webTrafficData).length != 0 &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
      ? {
          type: "stacked",
          sheetName: "Traffic Market Share vs. Peers",
          sheetTabColor: "#808080",
          req: convertTrafficMarketShareVsPeersDataToExcelFormat(
            webTrafficData,
            dataCutoffDate
          ),
          poweredBy: "Semrush",
        }
      : null,
    // TODO: Need to split cases on geo and non-geo data
    webTrafficData !== undefined &&
    Object.keys(webTrafficData).length != 0 &&
    Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0 &&
    webTrafficGeoData !== undefined &&
    Object.keys(webTrafficGeoData).length != 0 &&
    Object.keys(webTrafficGeoData?.[companyDic.displayedName]).length !== 0
      ? {
          type: "stacked",
          sheetName: "Traffic Breakdown vs. Peers",
          sheetTabColor: "#808080",
          req: convertTrafficBreakdownVsPeersDataToExcelFormat(
            webTrafficGeoData,
            webTrafficData
          ),
          poweredBy: "Semrush",
        }
      : null,
  ].filter(Boolean);
  const appUsageSectionBuilder = [];
  if (
    dataAIData &&
    (dataAIData[companyDic?.displayedName] || dataAIData[companyDic?.name]) &&
    Object.keys(dataAIData).length !== 0
  ) {
    appUsageSectionBuilder.push({
      type: "bar",
      sheetName: "App Users",
      sheetTabColor: "#FFFFCC",
      req: convertAppUsersChartDataToExcelFormat(
        dataAIData[companyDic?.displayedName || companyDic?.name][
          "app_performance"
        ],
        dataCutoffDate
      ),
      poweredBy: "Data AI",
      showDataLabels: false,
    });
    appUsageSectionBuilder.push(
      {
        type: "line",
        sheetName: "App Growth vs. Peers",
        sheetTabColor: "#FFFFCC",
        req: convertAppUsageGrowthVsPeersChartDataToExcelFormat(
          dataAIData,
          dataCutoffDate
        ),
        poweredBy: "Data AI",
      },
      {
        type: "stacked",
        sheetName: "Comparative App Market Share",
        sheetTabColor: "#FFFFCC",
        req: convertAppUsageMarketShareVsPeersDataToExcelFormat(
          dataAIData,
          dataCutoffDate
        ),
        poweredBy: "Data AI",
      },
      {
        type: "bar",
        sheetName: "App Loyalty vs. Peers",
        sheetTabColor: "#FFFFCC",
        req: convertAppUsageLoyalUsersVsPeersDataToExcelFormat(dataAIData),
        poweredBy: "Data AI",
      }
    );
  }
  const dividerBuilder = (name, tabColor) => ({
    type: "divider",
    sheetName: name,
    sheetTabColor: tabColor,
    req: {},
    poweredBy: "",
  });

  switch (name) {
    case "Headcount":
      getExcelDownload(
        headcountSectionBuilder,
        `${companyDic.displayedName} - ${country} (Headcount)`,
        devMode
      );
      break;
    case "Web Traffic":
      getExcelDownload(
        webTrafficSectionBuilder,
        `${companyDic.displayedName} - ${country} (Web Traffic)`,
        devMode
      );
      break;
    case "App Usage":
      getExcelDownload(
        appUsageSectionBuilder,
        `${companyDic.displayedName} - ${country} (App Usage)`,
        devMode
      );
      break;
    default:
      // Case of downloading everything
      getExcelDownload(
        [
          dividerBuilder("Headcount >>>", "#36A2EB"),
          ...headcountSectionBuilder,
          dividerBuilder("Web Traffic >>>", "#000000"),
          ...webTrafficSectionBuilder,
          dividerBuilder("App Usage >>>", "#FF9F40"),
          ...appUsageSectionBuilder,
        ],
        `${companyDic.displayedName} - ${country} (Full Report)`,
        devMode
      );
      break;
  }
}
