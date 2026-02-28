import { calculateImpactFromOrderItems } from "../business/impactCalculator.js";

export function buildImpactData(orderItems) {
  return calculateImpactFromOrderItems(orderItems);
}

