import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema(
  {
    module_name: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true }
  },
  { timestamps: true }
);

const AILog = mongoose.model("AILog", aiLogSchema);

export default AILog;
