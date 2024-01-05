const assert = require("assert");

export function parseSemrushOutput(output) {
  if (!output) {
    return;
  }
  const ret = [];
  const lines = output.trim().split("\n");
  const headers = lines[0].split(";");
  for (let item of lines.slice(1)) {
    assert.strictEqual(
      item.split(";").length,
      headers.length,
      "Number of headers and items do not match"
    );
    let dic = headers.reduce((obj, val, idx) => {
      obj[val] = item.split(";")[idx];
      return obj;
    }, {});
    ret.push(dic);
  }
  return ret;
}

export const generateMonths = (startYear) => {
  const dates = [];
  const today = new Date();
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
