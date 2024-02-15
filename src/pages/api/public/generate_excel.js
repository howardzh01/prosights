import { exec } from "child_process";

export default function handler(req, res) {
  const python = exec("python3 ./python/generate_excel.py", {
    encoding: "binary",
    maxBuffer: 1024 * 500,
  });

  let data = Buffer.from("");
  python.stdout.on("data", (chunk) => {
    data = Buffer.concat([data, Buffer.from(chunk, "binary")]);
  });

  python.stderr.on("data", (chunk) => {
    console.error("Python stderr: ", chunk.toString());
  });

  python.on("error", (error) => {
    console.error("Python process error: ", error);
    return res.status(500).send("Server Error");
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).send("Server Error");
    }

    // Set the headers
    res.setHeader("Content-Disposition", "attachment; filename=test.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", data.length);

    // Send the Excel binary data
    res.end(data, "binary");
  });
}
