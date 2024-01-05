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
  if (!data) {
    return;
  }
  const aggData = Object.entries(data).reduce((acc, [date, dic]) => {
    var timeInput;
    if (timescale === "quarterYear") {
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
