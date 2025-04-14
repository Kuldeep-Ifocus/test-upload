import express from "express";
import {
  startTestRecording,
  stopTestRecording,
  runPlaywrightScript,
  getAllTestScripts,
  getScriptById,
} from "../controllers/playwrightController.js";

const router = express.Router();

//Generate Script Routes
router.post("/run-playwright/:id", runPlaywrightScript);
router.post("/start-test", startTestRecording);
router.post("/stop-test", stopTestRecording);
router.get("/get-test-scripts", getAllTestScripts);
router.post("/get-script-by-id", getScriptById);

export default router;
