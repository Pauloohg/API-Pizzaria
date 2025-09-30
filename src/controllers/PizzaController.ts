import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Pizza } from "../entity/Pizza";

export class PizzaController {
  // Criar pizza
  static async create(req: Request, res: Response) {
    try {
      const { name, description, price, available, imageUrl } = req.body;

      if (!name || !description || !price) {
        return res.status(400).json({ message: "Campos obrigatórios: name, description, price" });
      }

      const pizzaRepository = AppDataSource.getRepository(Pizza);

      const pizza = pizzaRepository.create({
        name,
        description,
        price,
        available: available !== undefined ? available : true,
        imageUrl
      });

      await pizzaRepository.save(pizza);

      return res.status(201).json({
        message: "Pizza criada com sucesso",
        pizza
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar pizza", error });
    }
  }

  // Buscar todas
  static async getAll(req: Request, res: Response) {
    try {
      const pizzaRepository = AppDataSource.getRepository(Pizza);
      const pizzas = await pizzaRepository.find();

      return res.json(pizzas);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pizzas", error });
    }
  }

  // Buscar por ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pizzaRepository = AppDataSource.getRepository(Pizza);
      const pizza = await pizzaRepository.findOne({ where: { id: parseInt(id) } });

      if (!pizza) {
        return res.status(404).json({ message: "Pizza não encontrada" });
      }

      return res.json(pizza);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pizza", error });
    }
  }

  // Atualizar
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, available, imageUrl } = req.body;

      const pizzaRepository = AppDataSource.getRepository(Pizza);
      const pizza = await pizzaRepository.findOne({ where: { id: parseInt(id) } });

      if (!pizza) {
        return res.status(404).json({ message: "Pizza não encontrada" });
      }

      if (name) pizza.name = name;
      if (description) pizza.description = description;
      if (price) pizza.price = price;
      if (available !== undefined) pizza.available = available;
      if (imageUrl) pizza.imageUrl = imageUrl;

      await pizzaRepository.save(pizza);

      return res.json({
        message: "Pizza atualizada com sucesso",
        pizza
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar pizza", error });
    }
  }

  // Deletar
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pizzaRepository = AppDataSource.getRepository(Pizza);
      const pizza = await pizzaRepository.findOne({ where: { id: parseInt(id) } });

      if (!pizza) {
        return res.status(404).json({ message: "Pizza não encontrada" });
      }

      await pizzaRepository.remove(pizza);

      return res.json({ message: "Pizza deletada com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar pizza", error });
    }
  }
}