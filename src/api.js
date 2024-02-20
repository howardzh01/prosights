import api from "gpt-tokenizer/esm/encoding/cl100k_base";
import { UN_M49_CONTINENTS, RELEVANT_CONTINENTS } from "./constants";
import { assert } from "./utils/Utils";
import useSWR from "swr";
import { data } from "autoprefixer";

async function apiMultiCall(companyDisplayedNameList, func, args) {
  // Make sure first element of args is the company names or urls
  const promises = companyDisplayedNameList.map(
    (company, ind) => func([args[0][ind], ...args.slice(1)]) // replace args companyList with specific company
  );
  const results = await Promise.all(promises);
  return companyDisplayedNameList.reduce((acc, company, index) => {
    acc[company] = results[index];
    return acc;
  }, {});
}

export function getApiData(user, companyDicList, country, enableCrunchbase) {
  // Fill API Data calls here. So far, headcount, web traffic, crunchbase, company description
  // Make sure last argument of each function is the company names
  // console.log(companyDicList);
  if (!companyDicList) {
    return {
      headCountData: undefined,
      headCountError: undefined,
      webTrafficData: undefined,
      webTrafficError: undefined,
      webTrafficGeoData: undefined,
      webTrafficGeoError: undefined,
      crunchbaseDataPull: undefined,
      crunchbaseErrorPull: undefined,
      companyDescriptionPull: undefined,
      companyDescriptionErrorPull: undefined,
      dataAIData: undefined,
      dataAIError: undefined,
    };
  }

  const companyNameList = companyDicList.map((company) => company.name);
  const companyDisplayedNameList = companyDicList.map(
    (company) => company.displayedName
  );
  const companyUrlList = companyDicList.map(
    (company) => company.url || company.name + ".com"
  );
  const companyCrunchbaseNameList = companyDicList.map(
    (company) => company.cbSlug || company.name
  );

  const { data: headCountData, error: headCountError } = useSWR(
    user && companyNameList
      ? [companyNameList, `/api/private/getHeadCount`, user.id]
      : null,
    (args) => {
      return apiMultiCall(companyDisplayedNameList, getHeadCount, args);
    },
    { revalidateOnFocus: false }
  );

  const { data: webTrafficData, error: webTrafficError } = useSWR(
    user && companyNameList && country
      ? [companyUrlList, `/api/private/getWebTrafficData`, user.id, country]
      : null,

    (args) => {
      return apiMultiCall(companyDisplayedNameList, getTrafficData, args);
    },
    { revalidateOnFocus: false }
  );

  const { data: webTrafficGeoData, error: webTrafficGeoError } = useSWR(
    user && companyNameList
      ? [
          companyUrlList,
          `/api/private/getWebTrafficGeoData`,
          user.id,
          RELEVANT_CONTINENTS,
        ]
      : null,
    (args) => {
      return apiMultiCall(companyDisplayedNameList, getGeoTrafficData, args);
    },
    { revalidateOnFocus: false }
  );

  let crunchbaseDataPull,
    crunchbaseErrorPull,
    companyDescriptionPull,
    companyDescriptionErrorPull;
  if (enableCrunchbase) {
    const { data: crunchbaseData, error: crunchbaseError } = useSWR(
      user && companyCrunchbaseNameList
        ? [companyCrunchbaseNameList, `/api/private/getCrunchbaseData`, user.id]
        : null,
      (args) => {
        return apiMultiCall(companyDisplayedNameList, getCrunchbaseData, args);
      },
      { revalidateOnFocus: false }
    );

    // NOTE: companyDescription depends on crunchbase data
    const { data: companyDescription, error: companyDescriptionError } = useSWR(
      user && companyNameList && crunchbaseData
        ? [
            companyNameList,
            `/api/private/getCompanyDescription`,
            crunchbaseData,
          ]
        : null,

      async ([companyList, url, crunchbaseData]) => {
        const promises = companyList.map((company, ind) =>
          getCompanyDescription([
            company,
            url,
            user.id,
            crunchbaseData[companyDisplayedNameList[ind]]["fields"][
              "description"
            ],
          ])
        );
        const results = await Promise.all(promises);
        return companyDisplayedNameList.reduce((acc, company, index) => {
          acc[company] = results[index];
          return acc;
        }, {});
      },
      { revalidateOnFocus: false }
    );

    crunchbaseDataPull = crunchbaseData;
    crunchbaseErrorPull = crunchbaseError;
    companyDescriptionPull = companyDescription;
    companyDescriptionErrorPull = companyDescriptionError;
  }

  const { data: dataAIData, error: dataAIError } = useSWR(
    user && companyDicList && country
      ? [
          companyDicList.map((company) => company.appId),
          `/api/private/getDataAI`,
          user.id,
          country,
        ]
      : null,
    (args) => {
      return apiMultiCall(companyDisplayedNameList, getDataAIData, args);
    },
    { revalidateOnFocus: false }
  );

  return {
    headCountData,
    headCountError,
    webTrafficData,
    webTrafficError,
    webTrafficGeoData,
    webTrafficGeoError,
    crunchbaseDataPull,
    crunchbaseErrorPull,
    companyDescriptionPull,
    companyDescriptionErrorPull,
    dataAIData,
    dataAIError,
  };
}

export const getHeadCount = async ([companyName, api_url, userId]) => {
  // expect `/api/private/getHeadCount`
  // TODO: REMOVE IN FUTURE
  if (companyName.toLowerCase() === "goat") {
    return null;
  }
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      companyName: companyName,
    }),
  });
  if (!response.ok) {
    return null;
  }
  var data = await response.json();
  data = data.reverse();
  // transform to  {month: {key:value}}
  const formattedData = data.reduce((acc, item, i) => {
    const month = new Date(item.created);
    acc[month] = {
      headcount: item.headcount,
    };
    return acc;
  }, {});

  return formattedData;
};

export const getTrafficData = async ([
  companyUrl,
  api_url,
  userId,
  country,
]) => {
  // expect `/api/private/getWebTrafficData`
  if (!companyUrl) {
    return null;
  }
  const exportColumns =
    "target,rank,visits,desktop_visits,mobile_visits,users,desktop_users,mobile_users,desktop_hits,mobile_hits,direct,search_organic,search_paid,social_organic,social_paid,referral,mail,display_ad,search,social,paid,unknown_channel,time_on_site,desktop_time_on_site,mobile_time_on_site,pages_per_visit,desktop_pages_per_visit,mobile_pages_per_visit,bounce_rate,desktop_bounce_rate,mobile_bounce_rate,desktop_share,mobile_share,accuracy,display_date,country,device_type";

  const bodyObj = {
    userId: userId,
    companyUrl: companyUrl,
    exportColumns: exportColumns,
    country: country,
  };
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObj),
  });
  if (!response.ok) {
    return null;
  }
  var data = await response.json();
  // transform data into {month: {key:value}}
  if (!data) {
    return;
  }
  data = data.reduce((acc, item, i) => {
    if (!item || item.length === 0) {
      //no information for this month
      return acc;
    }
    const month = new Date(item[0]["display_date"]);

    // acc[month] = {
    //   visits: parseInt(item[0]["visits"], 10),
    //   users: parseInt(item[0]["users"], 10),
    // };
    acc[month] = Object.keys(item[0]).reduce((obj, key) => {
      obj[key] = parseInt(item[0][key], 10);
      return obj;
    }, {});
    return acc;
  }, {});
  return data;
};

export const getGeoTrafficData = async ([
  companyUrl,
  api_url,
  userId,
  relevant_continents,
]) => {
  //`/api/private/getWebTrafficGeoData`
  function getContinentName(continentItem) {
    // return continent name if exists and in relevant_continents else null
    if (!continentItem) {
      return;
    }
    let continent = UN_M49_CONTINENTS[parseInt(continentItem["geo"], 10)];
    if (!relevant_continents.includes(continent)) {
      return;
    }
    return continent;
  }

  const geoType = "continent";

  const bodyObj = {
    userId: userId,
    companyUrl: companyUrl,
    geoType: geoType,
  };
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObj),
  });
  if (!response.ok) {
    console.log(response.status);
    return null;
  }
  var data = await response.json();
  // transform data into {month: {key:value}}
  if (!data) {
    console.log("No data for geotraffic", companyUrl);
    return;
  }

  data = data.reduce((acc, monthItem, i) => {
    if (!monthItem || monthItem.length === 0) {
      //no information for this month
      return acc;
    }
    const month = new Date(monthItem[0]["display_date"]);

    // acc[month] = {
    //   visits: parseInt(item[0]["visits"], 10),
    //   users: parseInt(item[0]["users"], 10),
    // };
    monthItem.forEach((continentItem) => {
      let continentName = getContinentName(continentItem);
      if (!continentName) {
        return;
      }
      if (!acc[continentName]) {
        acc[continentName] = {};
      }
      acc[continentName][month] = Object.keys(continentItem).reduce(
        (obj, key) => {
          obj[key] = parseInt(continentItem[key], 10);
          return obj;
        },
        {}
      );
    });

    return acc;
  }, {});
  return data;
};

export const getCrunchbaseData = async ([companyName, api_url, userId]) => {
  // `/api/private/getCrunchbaseData`;
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      companyName: companyName,
    }),
  });
  if (!response.ok) {
    console.log(response.status);
    return null;
  }
  var data = await response.json();

  // Make request to refine the company description
  return data;
};

export const getCompanyDescription = async ([
  companyName,
  api_url,
  userId,
  crunchbaseDescription,
]) => {
  //`/api/private/getCompanyDescription`
  // data["fields"]["description"]
  // Should include company_description + business_model
  const descriptionResponse = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyName: companyName,
      crunchbaseDescription: crunchbaseDescription,
    }),
  });
  if (!descriptionResponse.ok) {
    console.log(descriptionResponse.status);
  }
  const content = await descriptionResponse.text();
  const json_content = JSON.parse(content);
  assert(
    "company_description" in json_content && "business_model" in json_content,
    "Missing company_description or business_model"
  );
  return json_content;
};

export const getDataAIData = async ([
  unifiedProductId,
  api_url,
  userId,
  country,
]) => {
  // `/api/private/getDataAIData`;
  console.log;
  if (!unifiedProductId) {
    console.log("NO UNIFIED PRODUCT ID");
    return null;
  }
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      unifiedProductId: unifiedProductId,
      country: country,
    }),
  });
  if (!response.ok) {
    console.log(response.status);
    return null;
  }
  var data = await response.json();
  if (!data) return;
  // Convert to {Date: item} and sort by Date
  const sortedAppPerformanceData = data["app_performance"]
    .map((item) => ({ date: new Date(item.start_date), item }))
    .sort((a, b) => a.date - b.date)
    .reduce((acc, { date, item }) => {
      acc[date] = item;
      return acc;
    }, {});
  const sortedRetentionData = data["retention"]
    .map((item) => ({ date: new Date(item.start_date), item }))
    .sort((a, b) => a.date - b.date)
    .reduce((acc, { date, item }) => {
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  // console.log(sortedRetentionData);
  // replace app_performance with sortedData
  return {
    ...data,
    app_performance: sortedAppPerformanceData,
    retention: sortedRetentionData,
  };
};

export const getExcelDownload = async (data, dev = false) => {
  try {
    const response = await fetch(
      `https://kev2010--generate-master-excel-generate-master-excel${
        dev ? "-dev" : ""
      }.modal.run`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "excel-file.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};
