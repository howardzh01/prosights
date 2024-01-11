import api from "gpt-tokenizer/esm/encoding/cl100k_base";
import { UN_M49_CONTINENTS } from "./constants";

export const getHeadCount = async (api_url, user, companyName) => {
  // expect `/api/private/getHeadCount`
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      companyName: companyName,
    }),
  });
  if (!response.ok) {
    return;
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

export const getTrafficData = async (api_url, user, companyUrl, country) => {
  // expect `/api/private/getWebTrafficData`
  const exportColumns =
    "target,rank,visits,desktop_visits,mobile_visits,users,desktop_users,mobile_users,desktop_hits,mobile_hits,direct,search_organic,search_paid,social_organic,social_paid,referral,mail,display_ad,search,social,paid,unknown_channel,time_on_site,desktop_time_on_site,mobile_time_on_site,pages_per_visit,desktop_pages_per_visit,mobile_pages_per_visit,bounce_rate,desktop_bounce_rate,mobile_bounce_rate,desktop_share,mobile_share,accuracy,display_date,country,device_type";

  const bodyObj = {
    userId: user.id,
    companiesUrl: companyUrl,
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
    console.log(response.status);
    return;
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

export const getGeoTrafficData = async (
  api_url,
  user,
  companyUrl,
  relevant_continents
) => {
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
    userId: user.id,
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

export const getCrunchbaseData = async (api_url, user, companyName) => {
  // `/api/private/getCrunchbaseData`;
  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      companyName: companyName,
    }),
  });
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  var data = await response.json();

  // Make request to refine the company description
  return data;
};

export const getCompanyDescription = async (
  api_url,
  user,
  companyName,
  crunchbaseDescription = ""
) => {
  //`/api/private/getCompanyDescription`
  // data["fields"]["description"]
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
  return await descriptionResponse.text();
};
