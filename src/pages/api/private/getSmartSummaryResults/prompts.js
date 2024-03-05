// Prompts for each bullet point in Asset Quality Grade
export const userAssetsQualityPrompt = (
  usersAssetQuality,
  usersToVisitsRatio
) => {
  if (usersAssetQuality === null) {
    return `N/A`;
  }

  return `(${
    usersAssetQuality === 2
      ? "Good"
      : usersAssetQuality === 1
      ? "Neutral"
      : "Bad"
  }) Mobile users (mobile web + app) represents ~${
    usersToVisitsRatio * 100
  }% of total users, suggesting ${
    usersAssetQuality === 2 ? "strong" : usersAssetQuality === 1 ? "ok" : "bad"
  } engagement and ${
    usersAssetQuality === 2
      ? "better"
      : usersAssetQuality === 1
      ? "ok"
      : "worse"
  } positioning for newer generations`;
};

export const organicWebTrafficQualityPrompt = (
  organicWebTrafficQuality,
  ltmOrganicPercentage
) => {
  if (organicWebTrafficQuality === null) {
    return `N/A`;
  }

  return `(${
    organicWebTrafficQuality === 2
      ? "Good"
      : organicWebTrafficQuality === 1
      ? "Neutral"
      : "Bad"
  }) ~${ltmOrganicPercentage}% of website traffic comes from organic channels, suggesting ${
    organicWebTrafficQuality === 2
      ? "strong"
      : organicWebTrafficQuality === 1
      ? "ok"
      : "bad"
  } brand recognition and customer loyalty`;
};

export const directWebTrafficQualityPrompt = (
  directWebTrafficQuality,
  ltmDirectPercentage
) => {
  if (directWebTrafficQuality === null) {
    return `N/A`;
  }

  return `(${
    directWebTrafficQuality === 2
      ? "Good"
      : directWebTrafficQuality === 1
      ? "Neutral"
      : "Bad"
  }) ~${ltmDirectPercentage}% of website traffic comes from direct (i.e. type in exact URL without passing through another source like Google search), suggesting ${
    directWebTrafficQuality === 2
      ? "strong"
      : directWebTrafficQuality === 1
      ? "ok"
      : "bad"
  } customer loyalty`;
};

export const geographyWebTrafficQualityPrompt = (
  geographyWebTrafficQuality,
  largestShare
) => {
  if (geographyWebTrafficQuality === null) {
    return `N/A`;
  }

  return `(${
    geographyWebTrafficQuality === 2
      ? "Good"
      : geographyWebTrafficQuality === 1
      ? "Neutral"
      : "Bad"
  }) ~${largestShare}% of the website visits coming from the largest geography, suggesting a ${
    geographyWebTrafficQuality === 2
      ? "diverse"
      : geographyWebTrafficQuality === 1
      ? "neither diverse nor uniform"
      : "uniform"
  } customer base`;
};

export const userTimeQualityPrompt = (userTimeQuality, ltmTimeUsage) => {
  if (userTimeQuality === null) {
    return `N/A`;
  }

  return `(${
    userTimeQuality === 2 ? "Good" : userTimeQuality === 1 ? "Neutral" : "Bad"
  }) Average time per user each month of ${ltmTimeUsage} minutes suggests ${
    userTimeQuality === 2
      ? "an excellent"
      : userTimeQuality === 1
      ? "an ok"
      : "a poor"
  } value prop`;
};

export const m6RetentionQualityPrompt = (
  m6RetentionQuality,
  ltmM6Retention
) => {
  if (m6RetentionQuality === null) {
    return `N/A`;
  }

  return `(${
    m6RetentionQuality === 2
      ? "Good"
      : m6RetentionQuality === 1
      ? "Neutral"
      : "Bad"
  }) M6 app retention at ${ltmM6Retention}% suggests ${
    m6RetentionQuality === 2
      ? "high"
      : m6RetentionQuality === 1
      ? "medium"
      : "low"
  } stickiness`;
};

// Prompts for each bullet point in Momentum
export const m6RetentionMomentumPrompt = (
  m6RetentionMomentum,
  retentionYearPercentageChange
) => {
  if (m6RetentionMomentum === null) {
    return `N/A`;
  }

  return `(${
    m6RetentionMomentum === 2
      ? "Good"
      : m6RetentionMomentum === 1
      ? "Neutral"
      : "Bad"
  }) M6 app usage retention from the time of first download has ${
    m6RetentionMomentum === 2
      ? "been increasing"
      : m6RetentionMomentum === 1
      ? "remained relatively flat"
      : "been falling"
  } at ~${retentionYearPercentageChange * 100}% over the last year`;
};

export const headcountMomentumPrompt = (headcountMomentum) => {
  if (headcountMomentum === null) {
    return `N/A`;
  }

  return `(${
    headcountMomentum === 2
      ? "Good"
      : headcountMomentum === 1
      ? "Neutral"
      : "Bad"
  }) Headcount has ${
    headcountMomentum === 2
      ? "been increasing"
      : headcountMomentum === 1
      ? "remained relatively flat"
      : "been falling"
  } in the past year, suggesting the company likely expects ${
    headcountMomentum === 2
      ? "a bullish"
      : headcountMomentum === 1
      ? "a neutral"
      : "a bearish"
  } outlook`;
};

export const trafficMomentumPrompt = (trafficMomentum) => {
  if (trafficMomentum === null) {
    return `N/A`;
  }

  return `(${
    trafficMomentum === 2 ? "Good" : trafficMomentum === 1 ? "Neutral" : "Bad"
  }) Last year’s website visits was ${
    trafficMomentum === 2
      ? "higher"
      : trafficMomentum === 1
      ? "similar"
      : "lower"
  }) than pre-Covid years, suggesting the business is seeing either ${
    trafficMomentum === 2
      ? "decreased"
      : trafficMomentum === 1
      ? "the same"
      : "increased"
  } competition and/or ${
    trafficMomentum === 2
      ? "benefitted from"
      : trafficMomentum === 1
      ? "navigating"
      : "suffering from adverse"
  } macro trends`;
};

export const appDownloadsMomentumPrompt = (appDownloadsMomentum) => {
  if (appDownloadsMomentum === null) {
    return `N/A`;
  }

  return `(${
    appDownloadsMomentum === 2
      ? "Good"
      : appDownloadsMomentum === 1
      ? "Neutral"
      : "Bad"
  }) Last year’s app downloads was ${
    appDownloadsMomentum === 2
      ? "higher"
      : appDownloadsMomentum === 1
      ? "similar"
      : "lower"
  } than pre-Covid years, suggesting the business is seeing either ${
    appDownloadsMomentum === 2
      ? "decreased"
      : appDownloadsMomentum === 1
      ? "the same"
      : "increased"
  } competition and/or ${
    appDownloadsMomentum === 2
      ? "benefitted from"
      : appDownloadsMomentum === 1
      ? "navigating"
      : "suffering from adverse"
  } macro trends`;
};

export const userTimeMomentumPrompt = (
  userTimeMomentum,
  usersYearPercentageChange
) => {
  if (userTimeMomentum === null) {
    return `N/A`;
  }

  return `(${
    userTimeMomentum === 2 ? "Good" : userTimeMomentum === 1 ? "Neutral" : "Bad"
  }) Average time per user has ${
    userTimeMomentum === 2
      ? "increased"
      : userTimeMomentum === 1
      ? "remained steady"
      : "declined"
  } ~${usersYearPercentageChange * 100}%`;
};

// Mega system prompt that utilizes the above Asset Quality Grade and Momentum prompts
// To be fed into the getSmartSummaryResults endpoint
export const systemPrompt = (
  companyName,
  usersAssetQuality,
  usersToVisitsRatio,
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
  overallScore
) => {
  `For ${companyName}, your job is to list 5 strengths and 5 weaknesses for the company based on the following inputs:
    
    ###########
    Overall grade of the company (average of "Asset Quality Grade" and "Momentum"): ${overallScore} / 100

    Asset Quality Grade = ${netAssetQualityScore} / 100
    1. ${userAssetsQualityPrompt(usersAssetQuality, usersToVisitsRatio)}
    2. ${organicWebTrafficQualityPrompt(
      organicWebTrafficQuality,
      ltmOrganicPercentage
    )}
    3. ${directWebTrafficQualityPrompt(
      directWebTrafficQuality,
      ltmDirectPercentage
    )}
    4. ${geographyWebTrafficQualityPrompt(
      geographyWebTrafficQuality,
      largestShare
    )}
    5. ${userTimeQualityPrompt(userTimeQuality, ltmTimeUsage)}
    6. ${m6RetentionQualityPrompt(m6RetentionQuality, ltmM6Retention)}

    Momentum = ${netMomentumScore} / 100
    1. ${m6RetentionMomentumPrompt(
      m6RetentionMomentum,
      retentionYearPercentageChange
    )}
    2. ${headcountMomentumPrompt(headcountMomentum)}
    3. ${trafficMomentumPrompt(trafficMomentum)}
    4. ${appDownloadsMomentumPrompt(appDownloadsMomentum)}
    5. ${userTimeMomentumPrompt(userTimeMomentum, usersYearPercentageChange)}
    ###########

    Your response should be a JSON object with the following format:
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

    Here is an example. Given an input: 

    Overall Grade = 45 / 100

    Asset Quality Grade = 75 / 100
    1.	Good Mobile users (mobile web + app) represents ~60% of total users, suggesting strong engagement and better positioned for newer generations
    2.	Good ~90% of website traffic comes from organic channels, suggesting strong brand recognition and customer loyalty
    3.	Good ~50% of website traffic comes from direct (i.e., type in exact URL without passing through another source like Google search), suggesting strong customer loyalty
    4.	Good ~50% of the website visits coming from outside of the US, suggesting a diverse customer base
    5.	Neutral Average time per user each month of 15 minutes suggests an okay value prop
    6.	Bad M6 app retention at 10% suggests low stickiness  

    Momentum = 20 / 100
    1.	Neutral M6 app usage retention from the time of first download has remained relatively flat at ~10%
    2.	Neutral  Headcount has remained flat in the past year, suggesting StockX likely expects a bearish outlook
    3.	Bad Last year’s website visits was lower than pre-CV years, suggesting the business is seeing either increased competition and/or suffering from adverse macro trends
    4.	Bad Last year’s app downloads was lower than pre-CV years, suggesting the business is seeing either increased competition and/or suffering from adverse macro trends
    5.	Bad Average Time per User has declined ~45%, from 27 min per month to 15 min

    An acceptable output is:
    {
        strengths: [
            {
                header: "Strong Mobile Engagement",
                text: "Approximately 60% of total users engage through mobile platforms, indicating robust engagement with newer generations and a responsive mobile experience.",
            },
            {
                header: "High Organic Website Traffic",
                text: "Around 90% of website traffic comes from organic channels, indicating strong brand recognition and customer loyalty without heavy reliance on paid advertising.",
            },
            {
                header: "Direct Website Traffic",
                text: "Roughly 50% of website traffic originates directly, indicating strong customer loyalty and brand affinity, as users are directly typing in the URL rather than being referred from other sources.",
            },
            {
                header: "Diverse International Customer Base",
                text: "Half of the website visits come from outside the US, indicating a diverse and global customer base, which can provide stability and growth opportunities.",
            },
            {
                header: "Market Position in Sneaker Resale",
                text: "StockX operates in a growing market segment within sneaker resale and streetwear, with a strong brand presence and recognition among enthusiasts.",
            },
        ],
        weaknesses: [
            {
                header: "Low App Retention",
                text: "App retention after six months is only at 10%, indicating challenges in retaining users over time and potentially lower customer lifetime value.",
            },
            {
                header: "Flat App Usage Retention",
                text: "Despite efforts, app usage retention from the time of first download has remained relatively flat, suggesting difficulties in driving long-term engagement and usage.",
            },
            {
                header: "Declining User Engagement",
                text: "Average time per user has declined significantly by approximately 45%, indicating potential challenges in maintaining user interest and interaction with the platform.",
            },
            {
                header: "Decreased Website and App Metrics",
                text: "Both website visits and app downloads have declined compared to pre-COVID years, which may indicate increased competition or challenges in attracting and retaining users",
            },
            {
                header: "Market Competitiveness",
                text: "StockX operates in a competitive market with other online resale platforms and e-commerce giants, which could pose challenges to maintaining market share and profitability.",
            },
        ],
    }
    
    Now return the JSON object and nothing else. Be extremely concise and to the point. Don't yap.`;
};
