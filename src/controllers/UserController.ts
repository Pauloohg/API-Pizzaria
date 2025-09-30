import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserController {
  // Login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      // 🔧 Ajuste: verificar se user existe E se tem password
      if (!user || !user.password) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao realizar login", error });
    }
  }

  // Criar usuário
  static async create(req: Request, res: Response) {
    try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "Campos obrigatórios: name, email, password, phone" });
      }

      const userRepository = AppDataSource.getRepository(User);

      const userExists = await userRepository.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address
      });

      await userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        user: userWithoutPassword
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar usuário", error });
    }
  }

  // Buscar todos
  static async getAll(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        select: ["id", "name", "email", "phone", "address", "createdAt"]
      });

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuários", error });
    }
  }

  // Buscar por ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        select: ["id", "name", "email", "phone", "address", "createdAt"]
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário", error });
    }
  }

  // Atualizar
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, phone, address, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (password) user.password = await bcrypt.hash(password, 10);

      await userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        message: "Usuário atualizado com sucesso",
        user: userWithoutPassword
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
  }

  // Deletar
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      await userRepository.remove(user);

      return res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar usuário", error });
    }
  }
}
