import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    plastic_saved_grams: { type: Number, default: 0 },
    carbon_saved_grams: { type: Number, default: 0 },
    locally_sourced: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

