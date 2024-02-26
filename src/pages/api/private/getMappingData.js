import {
  fetchCompanyList,
  parseCsvBufferToJson,
} from "../../../utils/BackendUtils.js";
import { serviceSup } from "../../../utils/Supabase.js";

export const config = {
  runtime: "nodejs",
};

const handler = async (req, res) => {
  // Assuming the request body is JSON and Content-Type is application/json
  const { csvUrl, companyUrl } = req.body; // Use req.body directly
  if (!csvUrl) {
    return res.status(404).json([]);
  }
  // let companyList = await fetchCompanyList(csvUrl);

  const { data: companyListBlob, error: downloadError } =
    await serviceSup.storage
      .from("backend_storage")
      .download(`${csvUrl.split("/").slice(-1)[0]}`);
  if (downloadError) {
    console.error(
      `Error fetching companies for ${csvUrl.split("/").slice(-1)[0]}:`,
      downloadError
    );
    return res.status(500).json({ error: "Failed to fetch companies" });
  }
  const buffer = await companyListBlob.arrayBuffer();

  let companyList = await parseCsvBufferToJson(Buffer.from(buffer));
  if (!companyList) {
    console.log("Error parsing CSV to JSON");
    return res.status(404).json([]);
  }
  if (companyUrl) {
    companyList = companyList.filter((company) => company.url === companyUrl);
    if (companyList.length === 0) {
      return res.status(404).json([]);
    }
    return res.status(200).json(companyList[0]);
  }
  const filteredCompanyList = companyList.map((company) => ({
    displayedName: company.displayedName,
    appId: company.appId,
    url: company.url,
  }));
  return res.status(200).json(filteredCompanyList);
};

export default handler;
