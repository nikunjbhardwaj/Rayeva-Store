import axios from "axios";
import AILog from "../models/AILog.js";

function buildGeminiPrompt(messages) {
  // Very simple: concatenate all roles/content into one text prompt
  return messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");
}

async function callGemini(messages, moduleName) {
  const prompt = buildGeminiPrompt(messages);
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set – returning placeholder response");
    const fallback =
      "AI is not configured yet. Please set GEMINI_API_KEY in the backend .env.";
    try {
      await AILog.create({
        module_name: moduleName,
        prompt,
        response: fallback
      });
    } catch (e) {
      console.warn("AILog create failed:", e.message);
    }
    return fallback;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    if (!text) {
      const noContent = "AI service did not return any content.";
      try {
        await AILog.create({
          module_name: moduleName,
          prompt,
          response: noContent
        });
      } catch (e) {
        console.warn("AILog create failed:", e.message);
      }
      return noContent;
    }
    try {
      await AILog.create({
        module_name: moduleName,
        prompt,
        response: text
      });
    } catch (e) {
      console.warn("AILog create failed:", e.message);
    }
    return text;
  } catch (err) {
    console.warn(
      `Gemini call failed for ${moduleName}:`,
      err.response?.status,
      err.response?.data?.error?.message || err.message
    );
    const fallback =
      "AI service is temporarily unavailable (rate limit or error). Using deterministic impact numbers only.";
    try {
      await AILog.create({
        module_name: moduleName,
        prompt,
        response: fallback
      });
    } catch (e) {
      console.warn("AILog create failed:", e.message);
    }
    return fallback;
  }
}

export async function generateImpactSummary(impactData) {
  const messages = [
    {
      role: "system",
      content:
        "You are a sustainability expert. Produce a concise, motivational sustainability impact summary for an order."
    },
    {
      role: "user",
      content: `Generate a human-readable sustainability impact summary with this data:\n${JSON.stringify(
        impactData
      )}\n\nWrite 2–3 short sentences.`
    }
  ];

  return await callGemini(messages, "impact_summary");
}

export async function generateChatReply(context) {
  const recentOrders = context.recentOrders || [];
  const focusedOrderId = context.focusedOrderId || null;

  const orderContext =
    recentOrders.length === 0
      ? "The user has no orders yet."
      : `User's recent orders (newest first). Each order has: id, shortId, status, total_amount, createdAt, products (array of { name, quantity, price }), and totalUnits (total number of items). Use this to answer order-related questions:\n${JSON.stringify(
          recentOrders,
          null,
          2
        )}\nWhen the user asks "my order", "last order", or "where is my order", refer to the most recent one and mention what they bought (e.g. "3× Bamboo Toothbrush" or "total 3 items"). When they ask "how many orders" or "all my orders", summarize the list. Use shortId (last 6 chars) when mentioning an order.`;

  const focusNote = focusedOrderId
    ? `\nThe user may be asking about a specific order they selected: ${focusedOrderId}. You can use this to prioritize that order in your answer.`
    : "";

  const messages = [
    {
      role: "system",
      content:
        "You are a friendly customer support assistant for a sustainable commerce startup. Be concise, clear, and empathetic. Answer using the order data provided; if the user has no orders, say so kindly."
    },
    {
      role: "user",
      content: `User message: ${context.message}\n\nKnown intent: ${context.intent}\n\n${orderContext}${focusNote}\n\nReply in 2-4 short sentences.`
    }
  ];

  return await callGemini(messages, "support_chat");
}

