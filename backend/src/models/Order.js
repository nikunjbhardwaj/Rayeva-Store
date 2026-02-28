import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    plastic_saved_grams: { type: Number, default: 0 },
    carbon_saved_grams: { type: Number, default: 0 },
    locally_sourced: { type: Boolean, default: false }
  },
  { _id: false }
);

const impactDataSchema = new mongoose.Schema(
  {
    plastic_saved_kg: Number,
    carbon_saved_kg: Number,
    locally_sourced_count: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    products: [orderItemSchema],
    total_amount: { type: Number, required: true },
    impact_data: impactDataSchema,
    impact_statement: { type: String },
    status: { type: String, default: "placed" }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

