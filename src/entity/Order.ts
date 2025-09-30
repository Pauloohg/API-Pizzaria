import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: "varchar",
    default: "pending"
  })
  status: string;

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  deliveryAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}