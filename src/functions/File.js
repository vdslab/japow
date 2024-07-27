import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function a() {
  const fs = require("fs");
  try {
    const files = fs.readdirSync("../docker-python/data");
    console.log(files);
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}
a();
