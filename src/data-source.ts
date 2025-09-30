import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Pizza } from "./entity/Pizza";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Pizza, Order, OrderItem],
  migrations: [],
  subscribers: [],
});