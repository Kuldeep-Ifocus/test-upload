import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TestScript from "../models/scriptModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recordingMap = new Map();

export const startTestRecording = (req, res) => {
  const { url, userId } = req.body;
  if (!url || !userId)
    return res.status(400).json({ error: "Missing url or userId" });

  const outputDir = path.join(__dirname, "../recorded");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputPath = path.join(outputDir, `record-${userId}.spec.ts`);
  const command = `npx playwright codegen ${url} --output="${outputPath}"`;

  const child = exec(command, (error) => {
    if (error) console.error(`Playwright error: ${error.message}`);
  });

  recordingMap.set(userId, { process: child, outputPath, url });

  res.json({ message: "Recording started" });

  child.on("exit", () => {
    console.log(`Recording for user ${userId} exited.`);
  });
};

export const stopTestRecording = async (req, res) => {
  const { userId } = req.body;

  const recording = recordingMap.get(userId);

  let outputPath;
  let url;

  if (recording) {
    recording.process.kill();
    outputPath = recording.outputPath;
    url = recording.url;
    recordingMap.delete(userId);
  } else {
    const fileName = `record-${userId}.spec.ts`;
    const filePath = path.join(__dirname, "../recorded", fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "No active recording or script file found for this user",
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

    await TestScript.create({
      userId,
      url,
      script: rawScript,
    });
    fs.unlinkSync(outputPath);

    res.json({ message: "Recording script saved to database" });
  } catch (err) {
    console.error("Error saving script:", err);
    res.status(500).json({ error: "Failed to save script" });
  }
};
