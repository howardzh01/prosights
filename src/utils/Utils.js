import { CONSTANTS } from "../constants";

// convert date to months
export const dateToMonths = (date) => {
  // Convert Date object 2023-01-01 to Jan 23)
  if (date.constructor === String) {
    date = new Date(date);
  }
  const month = date.toLocaleString("default", { month: "short" });
  const monthString = `${month} ${date.getUTCFullYear().toString().slice(2)}`;

  return monthString;
};

export const dateToQuarters = (date) => {
  // Convert Date object 2023-01-01 to 1Q23)
  if (date.constructor === String) {
    date = new Date(date);
  }
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
  const quarterString = `${quarter}Q${date
    .getUTCFullYear()
    .toString()
    .slice(2)}`;

  return quarterString;
};

export function convertToGrowthData(data) {
  // input: {time_key: output_key}
  // output: [-, %, % ...]
  if (!data) {
    return;
  }
  const values = Object.values(data);
  const percentGrowth = values.slice(1).map((value, index) => {
    const previousValue = values[index];
    const growth = ((value - previousValue) / previousValue) * 100;
    return growth.toFixed(0); // to keep 2 decimal places
  });
  return ["-", ...percentGrowth];
}

export const aggregateData = (
  data,
  output_key,
  agg = "sum",
  timescale = "quarterYear"
) => {
  // inputs: expected data in monthly format {Date(): {'visits': x, 'users': x}}
  // outputs: {time_key: output_key}
  console.log("timescale", timescale, data);
  if (!data) {
    return;
  }

  const aggData = Object.entries(data).reduce((acc, [date, dic]) => {
    var timeInput;
    if (timescale === "month") {
      timeInput = dateToMonths(date);
    } else if (timescale === "quarterYear") {
      timeInput = dateToQuarters(date);
    } else if (timescale === "year") {
      timeInput = new Date(date).getUTCFullYear();
    }
    acc[timeInput] = acc[timeInput] || { sum: 0, count: 0, last: 0 };
    acc[timeInput].sum += dic[output_key];
    acc[timeInput].count += 1;
    acc[timeInput].last = dic[output_key];

    return acc;
  }, {});

  return Object.entries(aggData).reduce(
    (acc, [timeInput, { sum, count, last }]) => {
      if (agg === "sum") {
        acc[timeInput] = sum;
      }

      if (agg === "mean") {
        acc[timeInput] = sum / count;
      }
      if (agg === "last") {
        acc[timeInput] = last;
      }
      return acc;
    },
    {}
  );
};

export const generateMonths = (startYear) => {
  const dates = [];
  const today = CONSTANTS.cutoffDate;
  const currentYear = today.getUTCFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    let endMonth = year === currentYear ? today.getUTCMonth() : 12;
    for (let month = 1; month <= endMonth; month++) {
      // Pad the month with a leading zero if necessary
      const monthString = String(month).padStart(2, "0");
      dates.push(`${year}-${monthString}-01`);
    }
  }
  return dates;
};

export const generateQuarters = (startYear) => {
  let quarters = [];
  const today = CONSTANTS.cutoffDate;
  const currentYear = today.getUTCFullYear();
  const currentQuarter = Math.floor((today.getUTCMonth() - 1) / 3) + 1; // -1 month to ensure quarter outputs after month ends
  for (let year = startYear; year <= currentYear; year++) {
    let endQuarter = year === currentYear ? currentQuarter : 4;
    for (let quarter = 1; quarter <= endQuarter; quarter++) {
      quarters.push(`${quarter}Q${year % 100}`);
    }
  }
  return quarters;
};

export const generateYears = (startYear) => {
  const years = [];
  const today = CONSTANTS.cutoffDate;
  const currentYear = today.getUTCFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};

export const convertMonthFormat = (date) => {
  const newDate = new Date(date);
  const month = newDate.toLocaleString("default", { month: "short" });
  const year = newDate.getUTCFullYear().toString().slice(2);
  return `${month} ${year}`;
};

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export function fromUnderscoreCase(underscoreString) {
  let normalString = underscoreString
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  return normalString;
}

const calculateGrowth = (current, previous) => {
  if (previous === 0 || !previous) return "--";
  return (((current - previous) / previous) * 100).toFixed(0) + "%";
};

export function isColorLight(r, g, b) {
  // Calculate the perceptive luminance of the color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6; // return true if light, false if dark
}

export function rgbToComponents(rgbString) {
  // This will turn "rgb(255, 255, 255)" into [255, 255, 255]
  return rgbString.match(/\d+/g).map(Number);
}
