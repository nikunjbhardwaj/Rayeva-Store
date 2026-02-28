const ORDER_KEYWORDS = ["order", "status", "tracking"];
const REFUND_KEYWORDS = ["refund", "money back"];
const RETURN_KEYWORDS = ["return", "exchange"];
const ESCALATION_KEYWORDS = ["complaint", "angry", "terrible", "bad service"];

export function classifyIntent(message) {
  const text = message.toLowerCase();

  if (containsAny(text, REFUND_KEYWORDS)) {
    return "refund_request";
  }
  if (containsAny(text, RETURN_KEYWORDS)) {
    return "return_request";
  }
  if (containsAny(text, ORDER_KEYWORDS)) {
    return "order_query";
  }
  if (containsAny(text, ESCALATION_KEYWORDS)) {
    return "escalation";
  }

  return "general_support";
}

export function shouldEscalate(intent, message) {
  if (intent === "refund_request" || intent === "escalation") return true;
  const text = message.toLowerCase();
  return containsAny(text, ESCALATION_KEYWORDS);
}

function containsAny(text, keywords) {
  return keywords.some((kw) => text.includes(kw));
}

