import { Router } from "express";
import {
  placeOrder,
  getOrderById,
  listOrders
} from "../controllers/orderController.js";

const router = Router();

router.get("/", listOrders);
router.post("/", placeOrder);
router.get("/:id", getOrderById);

export default router;

