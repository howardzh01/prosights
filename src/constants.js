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
