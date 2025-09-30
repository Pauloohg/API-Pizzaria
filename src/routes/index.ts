import { Router } from "express";
import userRoutes from "./user.routes";
import pizzaRoutes from "./pizza.routes";
import orderRoutes from "./order.routes";

const routes = Router();

routes.use(userRoutes);
routes.use(pizzaRoutes);
routes.use(orderRoutes);

export default routes;