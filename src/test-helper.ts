import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Pizza } from "./entity/Pizza";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";

export const TestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  logging: false,
  entities: [User, Pizza, Order, OrderItem],
  migrations: [],
  subscribers: [],
});