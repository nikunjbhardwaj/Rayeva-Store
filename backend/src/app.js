import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowed = process.env.FRONTEND_ORIGIN || "";
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow the primary domain
    if (origin === allowed) return callback(null, true);
    // Allow any Vercel preview deployment
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    // Block everything else
    callback(null, false);
  }
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Rayeva E-Commerce API running" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);

export default app;

