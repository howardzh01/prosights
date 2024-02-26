export const CONSTANTS = {
  MODEL_VERSION: "gpt-4-0125-preview",
  // MODEL_VERSION: "gpt-3.5-turbo",
  cutoffDate: new Date("2023-12-31"),
  MAPPINGS_CSV_URL:
    "/public/assets/mappings/prosights_mappings_v2_prod_subset.csv",
  API_LIMIT: 200,
};

export const CHARTJS_COLORS = [
  "rgba(0, 165, 241, 1)", //  Blue
  "rgba(255, 84, 130, 1)", // Red/Hot Pink
  "rgba(0, 195, 193, 1)", // Teal
  "rgba(255, 153, 24, 1)", // Orange
  "rgba(166, 99, 255, 1)", // Lavender
  "rgba(255, 203, 52, 1)", // Yellow
  "rgba(201, 203, 207, 1)", // Light Gray
  // ...add as many colors as you need, with labels as comments
];

export const CHARTJS_COLOR_PLUGIN = {
  id: "chartJSColorPlugin",
  beforeUpdate: (chart) => {
    if (
      chart.options.plugins &&
      chart.options.plugins.chartJSColorPlugin === false
    ) {
      return;
    }
    const backgroundColors = CHARTJS_COLORS;
    chart.data.datasets.forEach((dataset, index) => {
      dataset.backgroundColor =
        backgroundColors[index % backgroundColors.length];
    });
  },
};

export const UN_M49_CONTINENTS = {
  19: "North America",
  150: "Europe",
  419: "South America",
  142: "Asia",
  9: "Australia",
  202: "Sub-Saharan Africa",
  2: "Africa",
};

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const TIMESCALE_TRANSITION_DIC = {
  month: [undefined, "quarterYear"],
  quarterYear: ["month", "year"],
  year: ["quarterYear", undefined],
};

export const TIME_IN_MS = {
  "1_hour": 60 * 60 * 1000,
  "1_day": 24 * 60 * 60 * 1000,
};

// Ids of charts to uniquely define a graph. No values can be the same
export const CHARTS = {
  employeeCount: "Employee Count",
  traffic: "Traffic",
  trafficActiveUsers: "MAU",
  trafficByChannel: "Traffic by Channel",
  trafficByDevice: "Traffic by Device",
  trafficByOrganicVsPaid: "Traffic by Organic vs Paid",
  trafficByGeo: "Traffic by Geo",
  trafficCompsByChannel: "Traffic Competitors by Channel",
  trafficCompsByDevice: "Traffic Competitors by Device",
  trafficCompsByOrganicVsPaid: "Traffic Competitors by Organic vs Paid",
  trafficCompsByGeo: "Traffic Competitors by Geo",
  appLTMRetention: "M6 Usage Retention [TODO]",
  appLTMActiveDays: "Active Days",
  appLTMTimePerUser: "Average Time Per User",
  appLTMTimePerSession: "Average Session Duration",
  appActiveUsers: "App Users",
};

export const RELEVANT_CONTINENTS = [
  "North America",
  "South America",
  "Asia",
  "Europe",
  "Africa",
  "Australia",
];

export const US_STATE_TO_ABBREV = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
  "district of columbia": "DC",
  "american samoa": "AS",
  guam: "GU",
  "northern mariana islands": "MP",
  "puerto rico": "PR",
  "united states minor outlying islands": "UM",
  "u.s. virgin islands": "VI",
};

export const COUNTRY_LIST = {
  US: "United States",
  // CA: "Canada",
  // MX: "Mexico",
  // CN: "China",
  // KR: "South Korea",
  // JP: "Japan",
  // IN: "India",
  // GB: "United Kingdom",
  // FR: "France",
  // IT: "Italy",
  // DE: "Germany",
  // ES: "Spain",
  WW: "Worldwide",
  ROW: "Rest of World",
};

// Sections for sidebar; MUST have same title as section id, which might be used in child components
export const SECTIONS = [
  {
    title: "Company Overview",
    id: "Company Overview",
    parentId: "",
    level: 1,
  },
  {
    title: "Competitor Overview",
    id: "Competitor Overview",
    parentId: "",
    level: 1,
  },
  {
    title: "Headcount",
    id: "Headcount",
    parentId: "",
    level: 1,
  },
  {
    title: "Website Traffic",
    id: "Website Traffic",
    parentId: "",
    level: 1,
  },
  {
    title: "Growth",
    id: "Growth",
    parentId: "Website Traffic",
    level: 2,
  },
  {
    title: "Breakdown",
    id: "Breakdown",
    parentId: "Website Traffic",
    level: 2,
  },
  {
    title: "Quality Over Time",
    id: "Quality Over Time",
    parentId: "Website Traffic",
    level: 2,
  },
  {
    title: "Growth vs. Peers",
    id: "Traffic Growth vs. Peers",
    parentId: "Website Traffic",
    level: 2,
  },
  {
    title: "Market Share vs. Peers",
    id: "Traffic Market Share vs. Peers",
    parentId: "Website Traffic",
    level: 2,
  },
  {
    title: "Breakdown vs. Peers",
    id: "Traffic Breakdown vs. Peers",
    parentId: "Website Traffic",
    level: 2,
  },
  {
    title: "App Usage",
    id: "App Usage",
    parentId: "",
    level: 1,
  },
  {
    title: "Growth",
    id: "App Growth",
    parentId: "App Usage",
    level: 2,
  },
  {
    title: "Growth vs. Peers",
    id: "App Growth vs. Peers",
    parentId: "App Usage",
    level: 2,
  },
  {
    title: "Comparative Market Share vs. Peers",
    id: "App Comparative Market Share vs. Peers",
    parentId: "App Usage",
    level: 2,
  },
  {
    title: "Loyalty vs. Peers",
    id: "Loyalty vs. Peers",
    parentId: "App Usage",
    level: 2,
  },
  {
    title: "Consumer Spend",
    id: "Consumer Spend",
    parentId: "",
    level: 1,
  },
  {
    title: "Customer Loyalty vs. Peers",
    id: "Customer Loyalty vs. Peers",
    parentId: "Consumer Spend",
    level: 2,
  },
  {
    title: "Growth vs. Peers",
    id: "Consumer Growth vs. Peers",
    parentId: "Consumer Spend",
    level: 2,
  },
  {
    title: "Market Share vs. Peers",
    id: "Consumer Market Share vs. Peers",
    parentId: "Consumer Spend",
    level: 2,
  },
  {
    title: "Ad Spend",
    id: "Ad Spend",
    parentId: "",
    level: 1,
  },
  {
    title: "Market Spend",
    id: "Market Spend",
    parentId: "Ad Spend",
    level: 2,
  },
  {
    title: "Channel Breakdown",
    id: "Channel Breakdown",
    parentId: "Ad Spend",
    level: 2,
  },
  {
    title: "Breakdown vs. Peers",
    id: "Ad Breakdown vs. Peers",
    parentId: "Ad Spend",
    level: 2,
  },
];

const DATA_METHODOLOGY = {
  EMPLOYEE_HEADCOUNT:
    "Data sourced from public sources, primarily LinkedIn. However, discrepancies may occur when individuals list themselves as employed by a company on LinkedIn, despite not being full-time (i.e. freelancers)",
  WEB_TRAFFIC:
    "Data sourced from automated panel captures and indexes of public data across millions of monthly visits and website pages.",
  APP_USAGE:
    "Data sourced from a combination of public app store data, anonymized 1st party data, and consumer panels that track over 1 million apps.",
};

export const INFO_HOVERS = {
  SUMMARY: {
    ABOUT: (
      <span>
        <strong>Field:</strong> Explains what a company does, using proprietary
        LLM model that is trained with real-time web data and tailored to
        investor preferences.
      </span>
    ),
    BUSINESS_MODEL: (
      <span>
        <strong>Field:</strong> Explains how a company generates revenue,
        leveraging proprietary LLM model that is trained with real-time web data
        and tailored to investor preferences.
      </span>
    ),
    EMPLOYEE_HEADCOUNT: (
      <span>
        <strong>Metric:</strong> Estimated number of full-time employees at the
        end of the period (e.g., 4Q23 = December 2023).
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.EMPLOYEE_HEADCOUNT}
      </span>
    ),
    WEB_USERS: (
      <span>
        <strong>Metric:</strong> Monthly unique website visitors are individuals
        who have visited the site at least once during the month (includes
        mobile web but excludes app).
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    APP_USERS: (
      <span>
        <strong>Metric:</strong> Active monthly unique app users are individuals
        who have opened the app at least once during the month (excludes
        downloaded apps that are not opened).
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
  },
  TRAFFIC: {
    TOTAL_VISITS: (
      <span>
        <strong>Metric:</strong> Number of times visitors access a website.
        Subsequent pageviews within a 30 minute timespan are counted within the
        same visit. Total visits represents both desktop and mobile web but
        excludes app.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    WEB_USERS: (
      <span>
        <strong>Metric:</strong> Monthly unique website visitors are individuals
        who have visited the site at least once during the month (includes
        mobile web but excludes app).
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    GEOGRAPHY: (
      <span>
        <strong>Metric:</strong> Breakdown of web visits by a visitor’s
        geographic location
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    DEVICE_BREAKDOWN: (
      <span>
        <strong>Metric:</strong> Breakdown of web visits by a visitor’s device
        type: desktop vs. mobile web
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    CHANNEL: (
      <span>
        <strong>Metric:</strong> Breakdown of web visits by channel, as outlined
        below:
        <ul className="list-disc pl-8">
          <li>
            <strong>Direct:</strong> Traffic from direct site access without
            passing through another source (i.e., user types in the direct URL).
          </li>
          <li>
            <strong>Mail:</strong> Traffic from email marketing campaigns such
            as newsletters and promotional offers.
          </li>
          <li>
            <strong>Organic Search:</strong> Traffic from search engines such as
            Google.
          </li>
          <li>
            <strong>Organic Social:</strong> Traffic from social media sites
            such as Facebook and Instagram.
          </li>
          <li>
            <strong>Paid Visits:</strong> Traffic from paid advertising
            campaigns such as paid search, paid social, and display ads.
          </li>
          <li>
            <strong>Other:</strong> Traffic generated by unaccounted sources and
            referrals, where users reach target website after clicking on links
            from external sites like blog posts.
          </li>
        </ul>
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    ORGANIC_VS_PAID: (
      <span>
        <strong>Metric:</strong> Breakdown of visits by paid vs. organic
        channels into search and social.
        <ul className="list-disc pl-8">
          <li>
            <strong>Paid Search:</strong> Visits that come via paid search
            placements that appear on top of a search engine results page.
          </li>
          <li>
            <strong>Organic Search:</strong> Visits that come organically via
            search results without paid search placements.
          </li>
          <li>
            <strong>Paid Social:</strong> Visits that come from paid
            advertisements on social media platforms.
          </li>
          <li>
            <strong>Organic Social:</strong> Visits that come from organic
            posts, shares, and interactions on social media platforms.
          </li>
        </ul>
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    GROWTH_VS_PEERS: (
      <span>
        <strong>Metric:</strong> Comparison of year-over-year growth rates of
        web traffic visits by company
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
    MARKET_SHARE_VS_PEERS: (
      <span>
        <strong>Metric:</strong> Market share by company as calculated by
        proportion of total visits.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.WEB_TRAFFIC}
      </span>
    ),
  },
  APP_USAGE: {
    APP_DOWNLOADS: (
      <span>
        <strong>Metric:</strong> Estimated number of total app downloads for a
        given company in a specified time period (includes redownloads).
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    APP_USERS: (
      <span>
        <strong>Metric:</strong> Active monthly unique app users are individuals
        who have opened the app at least once during the month (excludes
        downloaded apps that are not opened).
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    GROWTH_VS_PEERS: (
      <span>
        <strong>Metric:</strong> Year-over-year growth rate of monthly active
        app users by company.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    MARKET_SHARE_VS_PEERS: (
      <span>
        <strong>Metric:</strong> Proportion of total monthly active users by
        company.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    M6_USAGE_RETENTION: (
      <span>
        <strong>Metric:</strong> Percentage of users returning to app on the 6th
        month after first downloading the app.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    ACTIVE_DAYS: (
      <span>
        <strong>Metric:</strong> Percentage of days in which a downloaded app is
        actually used.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    AVG_TIME_PER_USER: (
      <span>
        <strong>Metric:</strong> Average total time spent by an active user in
        an app during a specified time period.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
    AVG_TIME_PER_SESSION: (
      <span>
        <strong>Metric:</strong> Average time duration of a user session.
        <br />
        <br />
        <strong>Data Methodology:</strong> {DATA_METHODOLOGY.APP_USAGE}
      </span>
    ),
  },
};
