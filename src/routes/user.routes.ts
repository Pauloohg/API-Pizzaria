import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Rotas abertas
router.post("/login", UserController.login);
router.get("/users", UserController.getAll);
router.get("/users/:id", UserController.getById);

// Rotas protegidas
router.post("/users", authMiddleware, UserController.create);
router.put("/users/:id", authMiddleware, UserController.update);
router.delete("/users/:id", authMiddleware, UserController.delete);

export default router;