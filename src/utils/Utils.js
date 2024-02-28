import { CONSTANTS, MONTH_NAMES, CHARTS } from "../constants";

export function isEmpty(value) {
  if (!value) {
    // Checks for null or undefined
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (value.constructor === Object && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

// Utils for date formatting and generation
export const dateToMonths = (date, shortenYear = true) => {
  // Convert Date object 2023-01-01 or String to
  // 1. shortenYear=true Jan 23
  // 2. shortenYear=false Jan 2023
  date = new Date(date);

  const month = MONTH_NAMES[date.getUTCMonth()];
  const year = shortenYear
    ? String(date.getUTCFullYear()).slice(-2)
    : String(date.getUTCFullYear());

  return `${month} ${year}`;
};

export const dateToQuarters = (date) => {
  // Convert Date object 2023-01-01 to 1Q23)
  date = new Date(date);
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
  const quarterString = `${quarter}Q${date
    .getUTCFullYear()
    .toString()
    .slice(2)}`;

  return quarterString;
};

export function convertToGrowthData(data, returnType = "string") {
  // input: {time_key: output_key}
  // output: [-, %, % ...]
  let growthPercentages = [];
  const labels = Object.keys(data);
  let values = Object.values(data);
  // Regular expressions to identify label formats
  const monthlyRegex = /^[A-Za-z]+/;
  const quarterlyRegex = /^[1-4]Q/;
  const yearlyRegex = /^\d{4}$/;

  // Determine timescale based on the format of labels
  const isMonthly = labels.some((label) => monthlyRegex.test(label));
  const isQuarterly = labels.some((label) => quarterlyRegex.test(label));
  const isYearly = labels.some((label) => yearlyRegex.test(label));

  // Determine offset for growth calculation
  const offset = isYearly ? 1 : isMonthly ? 12 : isQuarterly ? 4 : 1; // Default to 1 if none match

  // Calculate the growth percentages
  for (let i = 0; i < values.length; i++) {
    if (
      i < offset ||
      values[i - offset] === 0 ||
      values[i - offset] == null ||
      values[i] == null
    ) {
      if (returnType == "string") {
        growthPercentages.push("--");
      } else {
        growthPercentages.push(null);
      }
    } else {
      const growth =
        ((values[i] - values[i - offset]) / values[i - offset]) * 100;
      if (returnType == "string") {
        growthPercentages.push(`${Math.round(growth)}%`);
      } else {
        growthPercentages.push(growth);
      }
    }
  }
  return growthPercentages;
}

export const aggregateData = (
  data,
  outputKey,
  agg = "sum",
  timescale = "quarterYear",
  startYear = 2019
) => {
  // inputs: expected data in monthly format {Date(): {'visits': x, 'users': x}}
  // outputs: {time_key: output_key}

  if (!data) {
    return;
  }

  // Sort the keys (dates) of the data object
  // console.log("AGG KEYS", JSON.stringify(Object.keys(data)));
  const sortedKeys = Object.keys(data).sort(
    (dateA, dateB) => new Date(dateA) - new Date(dateB)
  );

  let aggData = {};

  if (timescale === "month") {
    const allMonths =
      sortedKeys.length > 0
        ? generateMonthsBetweenDates(
            sortedKeys[0],
            sortedKeys[sortedKeys.length - 1]
          )
        : [];

    // Aggregation logic with all months
    aggData = allMonths.reduce((acc, month) => {
      acc[month] = { sum: 0, count: 0, last: 0 };

      Object.entries(data).forEach(([date, dic]) => {
        var timeInput = dateToMonths(date);
        if (timeInput === month) {
          acc[month].sum += dic[outputKey];
          acc[month].count += 1;
          acc[month].last = dic[outputKey];
        }
      });

      // Setting null for missing months
      if (acc[month].count === 0) {
        acc[month] = null;
      }

      return acc;
    }, {});
  } else {
    aggData = sortedKeys.reduce((acc, date) => {
      var timeInput;
      if (timescale === "quarterYear") {
        timeInput = dateToQuarters(date);
      } else if (timescale === "year") {
        timeInput = new Date(date).getUTCFullYear();
      }
      acc[timeInput] = acc[timeInput] || { sum: 0, count: 0, last: 0 };
      acc[timeInput].sum += data[date][outputKey];
      acc[timeInput].count += 1;
      acc[timeInput].last = data[date][outputKey]; // Correctly reflects the last entry for each quarter

      return acc;
    }, {});
  }

  // Generate timekeys that will be returned
  let allTimeKeys;
  if (timescale === "month") {
    allTimeKeys = generateMonthsFromStartYear(startYear, dateToMonths);
  } else if (timescale === "quarterYear") {
    allTimeKeys = generateQuarters(startYear);
  } else if (timescale === "year") {
    allTimeKeys = generateYears(startYear);
  }

  // Final output based on aggregation method
  return allTimeKeys.reduce((acc, timeInput) => {
    data = aggData[timeInput];
    if (!data) {
      acc[timeInput] = null;
    } else {
      if (agg === "sum") {
        acc[timeInput] = data.sum;
      } else if (agg === "mean") {
        acc[timeInput] = data.sum / data.count;
      } else if (agg === "last") {
        acc[timeInput] = data.last;
      }
    }
    return acc;
  }, {});
};

export function getTableInfo(data) {
  /*   
  data is output from aggregateData()
  Each value is a list all of same length
    labels: data.keys(),
    values: data.values(),
    tableHeaders: Top Headers eg. 2019 2020,
    tableLabels: Individual Labels eg. Q1 Q2 Q3 Q4,
    growthPercentages: growthPercentages,
  };
  */
  const labels = Object.keys(data);
  let values = Object.values(data);
  let tableHeaders = [];
  let tableLabels = [];
  let growthPercentages = convertToGrowthData(data);
  // Process labels and headers
  const isAllAnnual = labels.every((label) => /^\d{4}$/.test(label));

  labels.forEach((label) => {
    const yearMatch = label.match(/\d{2,4}$/);
    const year = yearMatch
      ? yearMatch[0].length === 2
        ? "20" + yearMatch[0]
        : yearMatch[0]
      : undefined;

    if (isAllAnnual) {
      tableHeaders.push("Annual");
      tableLabels.push(label);
    } else {
      tableHeaders.push(year || label);

      const quarterOrMonthMatch = label.match(/^[1-4]Q|^[A-Za-z]+/);
      if (quarterOrMonthMatch) {
        tableLabels.push(quarterOrMonthMatch[0]);
      } else {
        tableLabels.push(label);
      }
    }
  });

  return {
    labels: labels,
    values: values,
    tableHeaders: tableHeaders,
    tableLabels: tableLabels,
    growthPercentages: growthPercentages,
  };
}

export function preprocessAppDataTypes(
  multiCompanyAppData,
  type = CHARTS.appLTMTimePerUser
) {
  const processedMultiCompanyData = {};

  for (const [company, data] of Object.entries(multiCompanyAppData)) {
    if (!data) continue;
    let filteredData;
    // Handle retentiion data differently
    if (
      type === CHARTS.appLTMRetentionM3 ||
      type === CHARTS.appLTMRetentionM6
    ) {
      const retentionMonths = type === CHARTS.appLTMRetentionM3 ? 3 : 6;
      if (!data["retention"]) continue;
      filteredData = Object.entries(data["retention"]).reduce(
        (obj, [time, data]) => {
          let estRetention = data.filter(
            (item) => item?.retention_months === retentionMonths
          )?.[0]?.est_retention_value;
          obj[time] = estRetention * 100;
          return obj;
        },
        {}
      );
    } else {
      if (!data["app_performance"]) continue;
      filteredData = Object.entries(data["app_performance"])
        // .map(([time, data]) => data.est_percentage_active_days);
        .reduce((obj, [time, data]) => {
          if (type === CHARTS.appLTMTimePerUser) {
            obj[time] =
              data.est_average_time_per_user != null
                ? data.est_average_time_per_user / 60 / 1000
                : null;
          } else if (type === CHARTS.appLTMTimePerSession) {
            obj[time] =
              data.est_average_session_duration != null
                ? data.est_average_session_duration / 60 / 1000
                : null;
          }
          return obj;
        }, {});
    }
    processedMultiCompanyData[company] = filteredData;
  }
  return processedMultiCompanyData;
}
// Generate all months between two dates
const generateMonthsBetweenDates = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let allMonths = [];

  while (start <= end) {
    allMonths.push(dateToMonths(start));
    start.setUTCMonth(start.getUTCMonth() + 1);
  }
  return allMonths;
};

export const generateMonthsFromStartYear = (
  startYear,
  formatter = (x) => x
) => {
  const dates = [];
  const today = CONSTANTS.cutoffDate;
  const currentYear = today.getUTCFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    let endMonth = year === currentYear ? today.getUTCMonth() + 1 : 12;
    for (let month = 1; month <= endMonth; month++) {
      // Pad the month with a leading zero if necessary
      const monthString = String(month).padStart(2, "0");
      dates.push(formatter(`${year}-${monthString}-01`));
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
    years.push(`${year}`);
  }
  return years;
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

export function formatMoney(amount) {
  if (!amount) return amount;
  if (isNaN(amount)) return amount;
  let divisor, unit;
  if (Math.abs(amount) >= 1.0e12) {
    divisor = 1.0e12;
    unit = "T";
  } else if (Math.abs(amount) >= 1.0e9) {
    divisor = 1.0e9;
    unit = "B";
  } else if (Math.abs(amount) >= 1.0e5) {
    divisor = 1.0e6;
    unit = "M";
  } else if (Math.abs(amount) >= 1.0e3) {
    divisor = 1.0e3;
    unit = "K";
  } else {
    divisor = 1;
    unit = "";
  }

  let result = Math.abs(amount) / divisor;
  return result % 1 === 0 ? result.toFixed(0) + unit : result.toFixed(1) + unit;
}

export function roundPeNumbers(amount, decimalZero = true) {
  // make numbers 1 decimal if <10 else integers
  if (decimalZero && amount == 0) return "0.0"; // == because no type conversion
  if (!amount) {
    return amount;
  }
  if (isNaN(amount)) return amount;

  let result;
  const absAmount = Math.abs(amount);
  // // Converting everything to integers
  // result = Number(absAmount).toFixed(0);
  if (absAmount < 1e1) {
    result = Number(absAmount).toFixed(1);
  } else {
    result = Number(absAmount).toFixed(0);
  }
  // Add commas as thousand separators
  if (Number(result) >= 1000) {
    result = Number(result).toLocaleString();
  }
  // Prepend a minus sign if the original amount was negative
  if (amount < 0) {
    result = "-" + result;
  }
  return result;
}

// CRUNCHBASE API UTILS
export function formatDealRound(dealRound) {
  // secondary_market -> Secondary
  // series_a -> Series A
  return fromUnderscoreCase(dealRound)
    .replace("Market", "")
    .replace("Equity", "")
    .replace("Post Ipo", "Post-IPO")
    .trim();
}

export function findInsertIndex(arr, x, type = "left") {
  // left -> returns the index of the first element that is greater than or equal to x
  // right -> returns the index of the first element that is greater than x
  let low = 0,
    high = arr.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < x || (type === "right" && arr[mid] === x)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

export function convertLabelToDate(label) {
  // Example usage:
  // console.log(convertLabelToDate("3Q19")); // July 1st 2019
  // console.log(convertLabelToDate("Mar 19")); // March 1st 2019
  // console.log(convertLabelToDate("2019")); // January 1st 2019
  const quarterlyRegex = /^[1-4]Q\d{2}$/;
  const monthlyRegex = /^[A-Za-z]+ \d{2}$/;
  const yearlyRegex = /^\d{4}$/;

  if (quarterlyRegex.test(label)) {
    // Extract the quarter and year, then map to the first month of that quarter
    const quarter = parseInt(label[0]);
    const year = parseInt(label.slice(2)) + 2000; // Assuming '19' should be '2019'
    const month = (quarter - 1) * 3 + 1; // Get the first month of the quarter
    return new Date(year, month - 1, 1); // Months are 0-indexed in JavaScript Dates
  } else if (monthlyRegex.test(label)) {
    // Extract the month and year
    const monthName = label.split(" ")[0];
    const year = parseInt(label.split(" ")[1]) + 2000;
    const month = new Date(`${monthName} 1, 2000`).getUTCMonth(); // Use a dummy year to get the month index
    return new Date(year, month, 1);
  } else if (yearlyRegex.test(label)) {
    // Just the year is provided
    const year = parseInt(label);
    return new Date(year, 0, 1); // January 1st of the given year
  } else {
    throw new Error(`Unknown date format: ${label}`);
  }
}

export function normalizeStackedAggData(aggData) {
  // Calculate the total for each time_key across all channels
  // Two cases: {channel: {timekey: value}} or {company: {timekey: value}}
  // Missing values are treated as as {company: {}}
  const relevantKeys = Object.entries(aggData)
    .filter(([key, value]) => !isEmpty(value)) // Filter out entries where dic is null
    .map(([key, value]) => key); // Extract the names

  if (relevantKeys.length === 0) {
    return aggData; //means aggData values all empty dic
  }
  const totalsByTimeKey = Object.keys(aggData[relevantKeys[0]]).reduce(
    (acc, timeKey) => {
      acc[timeKey] = relevantKeys.reduce(
        (total, key) => total + aggData[key][timeKey],
        0
      );
      return acc;
    },
    {}
  );

  // Normalize each channel's value to sum to 100% for each time_key
  const normalizedData = Object.keys(aggData).reduce((acc, key) => {
    acc[key] = {};
    if (!aggData[key]) {
      return;
    }
    // Note: Use Object.keys instead of relevant keys so emptyValues stay empty {}
    Object.keys(aggData[key]).forEach((timeKey) => {
      const value = aggData[key][timeKey];
      const total = totalsByTimeKey[timeKey];
      acc[key][timeKey] = (value / total) * 100; // Convert to percentage
      if (isNaN(acc[key][timeKey])) {
        acc[key][timeKey] = null;
      }
    });
    return acc;
  }, {});
  return normalizedData;
}

export function reformatWebsiteUrl(unformattedUrl) {
  return unformattedUrl
    .replace("www.", "")
    .replace("http://", "")
    .replace("https://", "")
    .replace(/\/$/, "") // replace trailing slash
    .toLowerCase();
}

export function calculateMean(array) {
  // Filter out null and undefined values, then sum the remaining numbers
  const filteredArray = array.filter(
    (value) => value !== null && value !== undefined && !isNaN(value)
  );
  const sum = filteredArray.reduce((acc, value) => acc + value, 0);

  // Calculate the mean, avoiding division by zero
  const count = filteredArray.length;
  return count > 0 ? sum / count : null;
}

export const mergeAndOperate = (
  obj1,
  obj2,
  operatedKeys, // type array
  mergedOn, // type array
  operation
) => {
  // Function to merge two dictionaries and apply an operation to the values of certain keys based on mergedOn

  // Check if the keys in `mergedOn` are aligned
  const isAligned = mergedOn.every((key) => obj1[key] === obj2[key]);

  if (!isAligned) {
    console.error("The dictionaries are not aligned based on merged_on keys.");
    return;
  }
  // Create a new object to store the result
  const result = {};

  // Copy the merged_on keys and values to the result
  mergedOn.forEach((key) => {
    result[key] = obj1[key];
  });

  // Apply the operation to the values of other keys
  operatedKeys.forEach((key) => {
    if (!mergedOn.includes(key)) {
      if (obj1[key] == null || obj2[key] == null) {
        result[key] = null;
      } else {
        // Ensure we're not processing merged_on keys again
        result[key] = operation(obj1[key], obj2[key]);
      }
    }
  });

  return result;
};

export function formatNumberToAbbreviation(number) {
  if (isNaN(number) || number === null) {
    return "--";
  }

  let absNumber = Math.abs(number);
  let abbreviation = "";
  let divisor = 1;

  if (absNumber >= 1.0e9) {
    abbreviation = "B";
    divisor = 1.0e9;
  } else if (absNumber >= 1.0e6) {
    abbreviation = "M";
    divisor = 1.0e6;
  } else if (absNumber >= 1.0e3) {
    abbreviation = "K";
    divisor = 1.0e3;
  }

  if (divisor > 1) {
    let formattedNumber = (number / divisor).toFixed(1);
    // Ensure we don't end up with .0 after rounding
    if (formattedNumber.endsWith(".0")) {
      formattedNumber = formattedNumber.substring(
        0,
        formattedNumber.length - 2
      );
    }
    // If over 3 sigifig, dont add decimal. Eg: 842.1 -> 842
    if (formattedNumber.replace(".", "").length >= 4) {
      formattedNumber = (number / divisor).toFixed(0);
    }
    return `${formattedNumber}${abbreviation}`;
  }

  // If the number is less than 1000, just round it to 1 decimal point without any abbreviation
  return number.toFixed(1);
}

export const filterAndSortOptions = (options, { inputValue }) => {
  const limit = 50;
  if (inputValue === "") {
    return options.slice(0, limit);
  }

  const inputLower = inputValue.toLowerCase();

  // First priority: displayedName starts with input
  const displayedNameStartsWithInput = options.filter((option) =>
    option.displayedName.toLowerCase().startsWith(inputLower)
  );
  if (displayedNameStartsWithInput.length > limit) {
    return displayedNameStartsWithInput.slice(0, limit);
  }

  // Second priority: url starts with input, excluding those already included
  const urlStartsWithInput = options.filter(
    (option) =>
      option.url.toLowerCase().startsWith(inputLower) &&
      !displayedNameStartsWithInput.includes(option)
  );
  if (displayedNameStartsWithInput.length > limit) {
    return displayedNameStartsWithInput.slice(0, limit);
  }
  // Third priority: either displayedName or url contains the input but does not start with it,
  // excluding those already included in the first two priorities
  const nameOrUrlContainsInput = options.filter(
    (option) =>
      (option.displayedName.toLowerCase().includes(inputLower) ||
        option.url.toLowerCase().includes(inputLower)) &&
      !displayedNameStartsWithInput.includes(option) &&
      !urlStartsWithInput.includes(option)
  );

  // Combine the three arrays, maintaining the priority order
  const filteredOptions = [
    ...displayedNameStartsWithInput,
    ...urlStartsWithInput,
    ...nameOrUrlContainsInput,
  ];

  // Optionally, limit the number of options to improve performance
  return filteredOptions.slice(0, limit);
};

export const createCompanyDic = (value, companyDirectory) => {
  // Assuming value can be a string or an object with properties like name, url, and displayedName
  if (typeof value === "string") {
    if (value.includes(".")) {
      // check url
      const company = companyDirectory.findCompanyByUrl(value);
      return (
        company || {
          name: value.split(".")[0],
          url: value,
          displayedName: value.split(".")[0],
        }
      );
    } else {
      const company = companyDirectory.findCompanyByDisplayedName(value);
      return (
        company || { name: value, url: `${value}.com`, displayedName: value }
      );
    }
  } else {
    // Ensure displayedName is always set, defaulting to name if not provided
    if (!value.displayedName) {
      value.displayedName = value.name;
    }
    if (!value.name) {
      value.name = value.displayedName.toLowerCase();
    }
    return value;
  }
};

// Utility function to sum data for related keys. Used for web traffic channel tables
export function sumRelatedTableRows(
  tableDatasets,
  relatedKeys,
  valueType = "data"
) {
  return relatedKeys.reduce((acc, key) => {
    // Find the dataset corresponding to the current key
    const dataset = tableDatasets.find((d) => d.label === key);
    if (dataset) {
      dataset[valueType].forEach((value, index) => {
        // Initialize the accumulator for this index if necessary
        if (acc[index] === undefined) {
          acc[index] = 0;
        }
        // Ensure value is a number before adding it to the sum
        if (!isNaN(value)) {
          acc[index] += value;
        }
      });
    }
    return acc;
  }, []);
}
