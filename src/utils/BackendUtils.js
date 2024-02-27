const assert = require("assert");
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync"; // Correct import for synchronous parsing

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

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCompanyList(pathToFile) {
  const filePath = path.join(process.cwd(), pathToFile);
  // const filePath = "/assets/mappings/prosights_mappings_v1_prod_search.csv";
  const fileContent = fs.readFileSync(filePath, "utf8");
  try {
    const data = parse(fileContent, {
      columns: true, // Assumes the first row contains column names
      skip_empty_lines: true,
    });
    return data;
  } catch (error) {
    console.error("Failed to load company list:", error);
    return []; // Return an empty array in case of error
  }
}

export const parseCsvBufferToJson = (buffer) => {
  try {
    // Convert the buffer to a string using the appropriate encoding (e.g., 'utf-8')
    const csvText = buffer.toString("utf-8");

    // Parse the CSV data
    const records = parse(csvText, {
      columns: true, // Interpret the first row as column names
      skip_empty_lines: true,
    });

    return records;
  } catch (error) {
    console.error("Failed to parse CSV:", error);
    return [];
  }
};
