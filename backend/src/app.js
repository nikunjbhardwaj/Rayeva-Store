import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Sustainable Commerce API running" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);

export default app;

