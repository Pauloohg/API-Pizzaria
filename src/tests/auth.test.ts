import request from "supertest";
import app from "../server";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

describe("Auth e Users", () => {
  let token: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    // Criar admin para teste
    let admin = await userRepository.findOne({ where: { email: "admin@pizzaria.com" } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = userRepository.create({
        name: "Admin",
        email: "admin@pizzaria.com",
        password: hashedPassword,
        phone: "11999999999",
        address: "Rua Admin, 1"
      });
      await userRepository.save(admin);
    }

    // Login para obter token
    const res = await request(app).post("/login").send({
      email: "admin@pizzaria.com",
      password: "admin123"
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("Deve logar com credenciais válidas", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@pizzaria.com",
      password: "admin123"
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("Deve criar um novo usuário com token válido", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Teste",
        email: "teste@example.com",
        password: "123456",
        phone: "11977777777",
        address: "Rua Teste, 123"
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
  });

  it("Não deve criar usuário sem token", async () => {
    const res = await request(app).post("/users").send({
      name: "Sem Token",
      email: "sem@example.com",
      password: "123456",
      phone: "11977777777"
    });
    expect(res.status).toBe(401);
  });
});
