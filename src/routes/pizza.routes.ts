import { Router } from "express";
import { PizzaController } from "../controllers/PizzaController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Rotas abertas (GET)
router.get("/pizzas", PizzaController.getAll);
router.get("/pizzas/:id", PizzaController.getById);

// Rotas protegidas (POST, PUT, DELETE)
router.post("/pizzas", authMiddleware, PizzaController.create);
router.put("/pizzas/:id", authMiddleware, PizzaController.update);
router.delete("/pizzas/:id", authMiddleware, PizzaController.delete);

export default router;