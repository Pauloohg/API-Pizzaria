import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order, OrderStatus } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Pizza } from "../entity/Pizza";
import { User } from "../entity/User";

export class OrderController {
  // Criar pedido
  static async create(req: Request, res: Response) {
    try {
      const { userId, items, deliveryAddress } = req.body;

      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: "userId e items são obrigatórios" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const pizzaRepository = AppDataSource.getRepository(Pizza);
      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      let totalPrice = 0;
      const orderItems = [];

      for (const item of items) {
        const pizza = await pizzaRepository.findOne({ where: { id: item.pizzaId } });
        if (!pizza) {
          return res.status(404).json({ message: `Pizza com id ${item.pizzaId} não encontrada` });
        }

        if (!pizza.available) {
          return res.status(400).json({ message: `Pizza ${pizza.name} não está disponível` });
        }

        const itemPrice = pizza.price * item.quantity;
        totalPrice += itemPrice;

        const orderItem = orderItemRepository.create({
          pizza,
          quantity: item.quantity,
          price: itemPrice
        });

        orderItems.push(orderItem);
      }

      const order = orderRepository.create({
        user,
        totalPrice,
        deliveryAddress: deliveryAddress || user.address,
        items: orderItems
      });

      await orderRepository.save(order);

      const savedOrder = await orderRepository.findOne({
        where: { id: order.id },
        relations: ["user", "items", "items.pizza"]
      });

      return res.status(201).json({
        message: "Pedido criado com sucesso",
        order: savedOrder
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar pedido", error });
    }
  }

  // Buscar todos
  static async getAll(req: Request, res: Response) {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const orders = await orderRepository.find({
        relations: ["user", "items", "items.pizza"]
      });

      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pedidos", error });
    }
  }

  // Buscar por ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["user", "items", "items.pizza"]
      });

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      return res.json(order);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pedido", error });
    }
  }

  // Atualizar status
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ 
          message: "Status inválido. Use: pending, preparing, delivering, delivered, cancelled" 
        });
      }

      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      order.status = status;
      await orderRepository.save(order);

      return res.json({
        message: "Status do pedido atualizado com sucesso",
        order
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar pedido", error });
    }
  }

  // Deletar (cancelar)
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      await orderRepository.remove(order);

      return res.json({ message: "Pedido deletado com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar pedido", error });
    }
  }
}