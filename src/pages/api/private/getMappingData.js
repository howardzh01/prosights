import { fetchCompanyList } from "../../../utils/BackendUtils.js";

export const config = {
  runtime: "nodejs",
};

const handler = async (req, res) => {
  // Assuming the request body is JSON and Content-Type is application/json
  const { csvUrl, companyUrl } = req.body; // Use req.body directly
  if (!csvUrl) {
    return res.status(404).json([]);
  }
  let companyList = await fetchCompanyList(csvUrl);
  if (companyUrl) {
    companyList = companyList.filter((company) => company.url === companyUrl);
    return res.status(200).json(companyList);
  }

  return res.status(200).json(companyList);
};

export default handler;
