import mongoose from "mongoose";

const testScriptSchema = new mongoose.Schema({
  scriptId: String,
  url: String,
  script: String,
});

const TestScript = mongoose.model("TestScript", testScriptSchema);
export default TestScript;
