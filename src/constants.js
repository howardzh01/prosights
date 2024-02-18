export const CONSTANTS = {
  MODEL_VERSION: "gpt-4-0125-preview",
  // MODEL_VERSION: "gpt-3.5-turbo",
  cutoffDate: new Date("2024-01-01"),
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

export const CHARTS = {
  employeeCount: "Employee Count",
  traffic: "Traffic",
  mau: "MAU",
  trafficByChannel: "Traffic by Channel",
  trafficByDevice: "Traffic by Device",
  usersByDevice: "Users by Device",
  trafficByOrganicVsPaid: "Traffic by Organic vs Paid",
  trafficByGeo: "Traffic by Geo",
  appLTMRetention: "D30 Usage Retention",
  appLTMActiveDays: "Active Days",
  appLTMTimePerUser: "Average User Time Per Month",
  appLTMTimePerSession: "Average Session Time",
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
  CA: "Canada",
  MX: "Mexico",
  CN: "China",
  KR: "South Korea",
  JP: "Japan",
  IN: "India",
  GB: "United Kingdom",
  FR: "France",
  IT: "Italy",
  DE: "Germany",
  ES: "Spain",
  WW: "Worldwide",
};
