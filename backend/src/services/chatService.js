import ChatLog from "../models/ChatLog.js";
import Order from "../models/Order.js";
import { classifyIntent, shouldEscalate } from "../business/intentClassifier.js";
import { generateChatReply } from "./aiService.js";

export async function handleIncomingMessage({ chatId, message, orderId }) {
  const intent = classifyIntent(message);
  const escalate = shouldEscalate(intent, message);

  // Always fetch recent orders so the bot can answer "my orders", "last order", etc.
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const recentOrdersSummary = recentOrders.map((o) => {
    const products = o.products || [];
    const totalUnits = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    return {
      id: String(o._id),
      shortId: String(o._id).slice(-6),
      status: o.status,
      total_amount: o.total_amount,
      createdAt: o.createdAt,
      itemCount: products.length,
      totalUnits,
      products: products.map((p) => ({
        name: p.name,
        quantity: p.quantity || 1,
        price: p.price
      }))
    };
  });

  let botReply = "";

  if (intent === "refund_request") {
    botReply =
      "I understand you’d like a refund. Our policy allows refunds within 7 days of delivery for unused items. I have escalated this to a human agent.";
  } else if (intent === "return_request") {
    botReply =
      "You can return or exchange items within 7 days of delivery. Please share your order ID and reason, and I’ll help you with the next steps.";
  } else if (intent === "escalation") {
    botReply =
      "I’m sorry about your experience. I’ve flagged this conversation for a human support agent who will review it shortly.";
  } else {
    botReply = await generateChatReply({
      message,
      intent,
      recentOrders: recentOrdersSummary,
      focusedOrderId: orderId || null
    });
  }

  let chatLog;
  if (chatId) {
    chatLog = await ChatLog.findById(chatId);
  }
  if (!chatLog) {
    chatLog = await ChatLog.create({
      orderId: orderId || null,
      messages: [],
      escalated: escalate
    });
  }

  chatLog.messages.push(
    { sender: "user", text: message, intent },
    { sender: "bot", text: botReply, intent }
  );
  if (escalate) {
    chatLog.escalated = true;
  }

  await chatLog.save();

  return {
    chatId: chatLog._id,
    botReply,
    intent,
    escalated: chatLog.escalated
  };
}

