import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TestScript from "../models/scriptModel.js";
import {
  validateBrowserType,
  launchBrowser,
  executeScript,
} from "../services/browserService.js";
import { nanoid } from "nanoid";

export const runPlaywrightScript = async (req, res) => {
  const { browserType = "chromium" } = req.body;
  const { id } = req.params;
  let browser;

  try {
    const validatedBrowserType = validateBrowserType(browserType);
    browser = await launchBrowser(validatedBrowserType);

    // Fetch script from DB
    const fetchedScript = await TestScript.findById(id);
    if (!fetchedScript || typeof fetchedScript.script !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "No valid script found in database" });
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    // Run the script
    await executeScript(page, fetchedScript.script);

    await context.close();
    await browser.close();

    res.json({
      success: true,
      message: `Script executed successfully using ${browserType} browser`,
    });
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recordingMap = new Map();

export const startTestRecording = (req, res) => {
  try {
    const scriptId = nanoid();
    const { url } = req.body;

    if (!url)
      return res.status(400).json({ error: "Missing 'url' in request body" });

    const outputDir = path.join(__dirname, "../recorded");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputPath = path.join(outputDir, `script-${scriptId}.spec.ts`);
    const command = `npx playwright codegen ${url} --output="${outputPath}"`;

    const child = exec(command, (error) => {
      if (error) {
        console.error(`Playwright error: ${error.message}`);
      }
    });

    recordingMap.set(scriptId, { process: child, outputPath, url });

    child.on("exit", () => {
      console.log(`Recording for script ${scriptId} exited.`);
    });

    res.json({ message: "Recording started", scriptId });
  } catch (err) {
    console.error("Error in startTestRecording:", err);
    res.status(500).json({ error: "Failed to start recording" });
  }
};

export const stopTestRecording = async (req, res) => {
  const { scriptId } = req.body;

  if (!scriptId) {
    return res
      .status(400)
      .json({ error: "Missing 'scriptId' in request body" });
  }

  const recording = recordingMap.get(scriptId);

  let outputPath;
  let url;

  if (recording) {
    recording.process.kill();
    outputPath = recording.outputPath;
    url = recording.url;
    recordingMap.delete(scriptId);
  } else {
    const fileName = `script-${scriptId}.spec.ts`;
    const filePath = path.join(__dirname, "../recorded", fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "No active recording or script file found for this scriptId",
      });
    }
    outputPath = filePath;
    url = "Unknown";
  }

  try {
    const script = fs.readFileSync(outputPath, "utf-8");

    const lines = script.split("\n");

    let capture = false;
    let braceCount = 0;
    let extractedLines = [];

    for (const line of lines) {
      if (line.includes("test(") && line.includes("=> {")) {
        capture = true;
        braceCount = 1;
        continue;
      }

      if (capture) {
        if (line.includes("{")) braceCount++;
        if (line.includes("}")) braceCount--;

        if (braceCount === 0) {
          capture = false;
          break;
        }

        extractedLines.push(line);
      }
    }

    const rawScript = extractedLines.join("\n").trim();

    // Instead of saving to MongoDB, save to Git repository
    const repoPath = path.join(__dirname, "../../test-scripts-repo");
    const scriptFilePath = path.join(repoPath, `script-${scriptId}.js`);

    // Create repo directory if it doesn't exist
    if (!fs.existsSync(repoPath)) {
      fs.mkdirSync(repoPath, { recursive: true });

      // Initialize Git repo if it doesn't exist
      await new Promise((resolve, reject) => {
        exec(`cd "${repoPath}" && git init`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Git init error: ${error.message}`);
            return reject(error);
          }
          resolve(stdout);
        });
      });
    }

    // Write script to file in the repo
    fs.writeFileSync(
      scriptFilePath,
      `// Test script for URL: ${url}\n// Generated on: ${new Date().toISOString()}\n\n${rawScript}`
    );

    // Add and commit to Git
    await new Promise((resolve, reject) => {
      exec(
        `cd "${repoPath}" && git add "${scriptFilePath}" && git commit -m "Add test script for
          // url || "unknown URL"
        (ID: ${scriptId})"`,
        (error, stdout, stderr) => {
          if (error) {
            // If nothing to commit, don't treat as error
            if (stderr && stderr.includes("nothing to commit")) {
              console.log("No changes to commit");
              return resolve("No changes to commit");
            }
            console.error(`Git commit error: ${error.message}`);
            return reject(error);
          }
          resolve(stdout);
        }
      );
    });

    // Pull from main and push to main branch
    await new Promise((resolve, reject) => {
      exec(`git push origin main`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Git push error: ${error.message}`);
          console.error(`Git push stderr: ${stderr}`); // Log standard error output
          return reject(error);
        }
        console.log(`Git push stdout: ${stdout}`); // Log standard output
        resolve(stdout);
      });
    });

    // Clean up the original recording file
    fs.unlinkSync(outputPath);

    res.json({
      message: "Recording script saved and pushed to Git repository",
      scriptId: scriptId,
      location: scriptFilePath,
      repoPath: repoPath,
    });
  } catch (gitError) {
    console.warn("Git operations failed:", gitError.message);

    // Clean up the original recording file anyway
    fs.unlinkSync(outputPath);

    res.json({
      message: "Recording script saved to Git repository locally",
      note: "Script was committed locally but push failed. Please check Git configuration.",
      scriptId: scriptId,
      location: scriptFilePath,
    });
  }
};

export const getAllTestScripts = async (req, res) => {
  const scripts = await TestScript.find();
  if (!scripts) throw new Error("Unable to fetch Test Scripts");
  res.status(200).json({
    status: "success",
    message: "Scripts fetched successfully",
    scripts,
  });
};

export const getScriptById = async (req, res) => {
  try {
    const { scriptId } = req.body;

    if (!scriptId) {
      return res.status(400).json({
        status: "error",
        message: "Script ID is required",
      });
    }

    const script = await TestScript.findOne({ scriptId });

    if (!script) {
      return res.status(404).json({
        status: "error",
        message: "Script not found",
      });
    }

    res.json({
      status: "success",
      message: "Script fetched successfully",
      data: script,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error while fetching script",
      error: error.message,
    });
  }
};
