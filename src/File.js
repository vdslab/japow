import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function a() {
  const fs = require("fs");
  const files = fs.readdirSync("../docker-python/data");
  console.log(files);
  return files;
}
