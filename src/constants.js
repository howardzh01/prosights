export const CONSTANTS = {
  MODEL_VERSION: "gpt-4-1106-preview",
  // MODEL_VERSION: "gpt-3.5-turbo",
  cutoffDate: new Date("2024-01-01"),
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
};

export const RELEVANT_CONTINENTS = [
  "North America",
  "South America",
  "Asia",
  "Europe",
  "Africa",
  "Australia",
];
