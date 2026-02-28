import Order from "../models/Order.js";
import { buildImpactData } from "../services/impactService.js";
import { generateImpactSummary } from "../services/aiService.js";

// Demo catalog impact data (grams per unit)
const PRODUCT_IMPACT = {
  "bamboo-toothbrush": {
    plastic_saved_grams: 20,
    carbon_saved_grams: 50,
    locally_sourced: true
  },
  "steel-bottle": {
    plastic_saved_grams: 500,
    carbon_saved_grams: 1200,
    locally_sourced: false
  },
  "compostable-cutlery": {
    plastic_saved_grams: 40,
    carbon_saved_grams: 80,
    locally_sourced: true
  },
  "recycled-notebook": {
    plastic_saved_grams: 5,
    carbon_saved_grams: 30,
    locally_sourced: false
  }
};

export async function placeOrder(req, res) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const orderItems = items.map((item) => {
      const impact = PRODUCT_IMPACT[item.id] || PRODUCT_IMPACT[item.productId] || {};
      return {
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        plastic_saved_grams: impact.plastic_saved_grams || 0,
        carbon_saved_grams: impact.carbon_saved_grams || 0,
        locally_sourced: impact.locally_sourced || false
      };
    });

    const total_amount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const impact_data = buildImpactData(orderItems);
    const impact_statement = await generateImpactSummary(impact_data);

    const order = await Order.create({
      products: orderItems,
      total_amount,
      impact_data,
      impact_statement
    });

    res.status(201).json({
      orderId: order._id,
      total_amount: order.total_amount,
      impact_data: order.impact_data,
      impact_statement: order.impact_statement,
      status: order.status
    });
  } catch (err) {
    console.error("placeOrder error", err);
    res
      .status(500)
      .json({ error: "Failed to place order", details: err.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

export async function listOrders(req, res) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(
      orders.map((o) => ({
        id: o._id,
        total_amount: o.total_amount,
        status: o.status,
        createdAt: o.createdAt
      }))
    );
  } catch (err) {
    console.error("listOrders error", err);
    res.status(500).json({ error: "Failed to list orders" });
  }
}

