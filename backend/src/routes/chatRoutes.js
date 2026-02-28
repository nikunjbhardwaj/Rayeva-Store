import { Router } from "express";
import { handleMessage, getChatById } from "../controllers/chatController.js";

const router = Router();

router.post("/message", handleMessage);
router.get("/:id", getChatById);

export default router;

