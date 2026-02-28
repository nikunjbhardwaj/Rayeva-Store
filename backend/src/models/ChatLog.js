import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    intent: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const chatLogSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    messages: [messageSchema],
    escalated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

export default ChatLog;

