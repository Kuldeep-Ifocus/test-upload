import { chromium, firefox, webkit } from "playwright";

const validBrowsers = [
  "chromium",
  "firefox",
  "webkit",
  "google chrome",
  "microsoft edge",
];

export const validateBrowserType = (browserType) => {
  if (!validBrowsers.includes(browserType.toLowerCase())) {
    throw new Error(
      "Invalid browser type. Must be one of: chromium, firefox, webkit, google chrome, microsoft edge"
    );
  }
  return browserType.toLowerCase();
};

export const launchBrowser = async (browserType) => {
  switch (browserType) {
    case "google chrome":
      return await chromium.launch({ headless: false, channel: "chrome" });
    case "microsoft edge":
      return await chromium.launch({ headless: false, channel: "msedge" });
    case "firefox":
      return await firefox.launch({ headless: false });
    case "webkit":
      return await webkit.launch({ headless: false });
    default:
      return await chromium.launch({ headless: false });
  }
};

export const executeScript = async (page, script) => {
  if (!script || typeof script !== "string") {
    throw new Error("Script must be provided as a string");
  }

  // Split the script into individual statements and add delays
  const statements = script.split(";").filter((s) => s.trim() !== "");
  let scriptWithDelays = "";
  const delayMs = 1000; // 1 second delay between actions
  statements.forEach((statement, index) => {
    scriptWithDelays += statement.trim();
    if (index < statements.length - 1) {
      scriptWithDelays += `; await page.waitForTimeout(${delayMs});`;
    }
  });

  // Create a function from the modified script string
  const scriptFunction = new Function(
    "page",
    `return (async () => { ${scriptWithDelays} })();`
  );

  // Execute the script with the page object
  await scriptFunction(page);
};
