import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Rotas abertas
router.get("/orders", OrderController.getAll);
router.get("/orders/:id", OrderController.getById);

// Rotas protegidas
router.post("/orders", authMiddleware, OrderController.create);
router.put("/orders/:id", authMiddleware, OrderController.update);
router.delete("/orders/:id", authMiddleware, OrderController.delete);

export default router;