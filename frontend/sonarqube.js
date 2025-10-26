import { resolve } from "path";
import { config } from "dotenv";

import * as sonnar from "sonarqube-scanner";

const scanner = sonnar.scan;

const envFileName = ".env";
const envFilePath = resolve(process.cwd(), envFileName);

const result = config({ path: envFilePath });

if (result.error) {
  console.error(`-> Error loading ${envFileName}:`, result.error);
  process.exit(1);
}

console.log(`\nFile ${envFileName} loaded successfully`);

scanner(
  {
    serverUrl: "http://localhost:9000",
    token: process.env.SONAR_TOKEN,
    options: {
      "sonar.projectName": "daule-vpublica-reactjs",
      "sonar.projectDescription": "daule-vpublica-reactjs",
      "sonar.sources": "src",
      "sonar.typescript.file.suffixes": ".ts,.tsx",
      "sonar.javascript.file.suffixes": ".js,.jsx",
      "sonar.language": "ts",
      "sonar.sourceEncoding": "utf-8",
    },
  },
  (error) => {
    if (error) {
      console.error(error);
    }
    process.exit();
  }
);
