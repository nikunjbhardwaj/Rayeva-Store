import { handleIncomingMessage } from "../services/chatService.js";
import ChatLog from "../models/ChatLog.js";

export async function handleMessage(req, res) {
  try {
    const { chatId, message, orderId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await handleIncomingMessage({ chatId, message, orderId });

    res.json(result);
  } catch (err) {
    console.error("handleMessage error", err);
    res.status(500).json({ error: "Failed to handle message" });
  }
}

export async function getChatById(req, res) {
  try {
    const chat = await ChatLog.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({
      chatId: chat._id,
      orderId: chat.orderId || null,
      messages: chat.messages,
      escalated: chat.escalated
    });
  } catch (err) {
    console.error("getChatById error", err);
    res.status(500).json({ error: "Failed to load chat history" });
  }
}

