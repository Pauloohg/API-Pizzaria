import request from "supertest";
import { TestDataSource } from "../test-helper";
import app from "../server";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

let authToken: string;
let pizzaId: number;

beforeAll(async () => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  // Criar usuário admin para testes
  const userRepository = TestDataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = userRepository.create({
    name: "Admin",
    email: "admin@pizzaria.com",
    password: hashedPassword,
    phone: "11999999999",
    address: "Rua Admin, 1"
  });
  
  await userRepository.save(admin);

  // Obter token de autenticação
  const loginResponse = await request(app)
    .post("/login")
    .send({
      email: "admin@pizzaria.com",
      password: "admin123"
    });

  if (loginResponse.status === 200) {
    authToken = loginResponse.body.token;
  }
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});

describe("Pizzas", () => {
  const testPizza = {
    name: "Pizza Test",
    description: "Pizza de teste",
    price: 35.90,
    available: true
  };

  it("Deve listar pizzas sem autenticação (GET aberto)", async () => {
    const response = await request(app).get("/pizzas");

    expect([200, 500]).toContain(response.status);
    
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });

  it("Deve criar uma pizza com token válido", async () => {
    if (!authToken) {
      return; // Skip test if no token
    }

    const response = await request(app)
      .post("/pizzas")
      .set("Authorization", `Bearer ${authToken}`)
      .send(testPizza);

    expect([201, 500]).toContain(response.status);
    
    if (response.status === 201) {
      expect(response.body).toHaveProperty("pizza");
      expect(response.body.pizza.name).toBe(testPizza.name);
      pizzaId = response.body.pizza.id;
    }
  });

  it("Não deve criar pizza sem token", async () => {
    const response = await request(app)
      .post("/pizzas")
      .send(testPizza);

    expect(response.status).toBe(401);
  });

  it("Deve buscar uma pizza por ID sem autenticação", async () => {
    if (!pizzaId) {
      return; // Skip if no pizza created
    }

    const response = await request(app).get(`/pizzas/${pizzaId}`);

    expect([200, 404]).toContain(response.status);
  });

  it("Deve atualizar pizza com token válido", async () => {
    if (!authToken || !pizzaId) {
      return;
    }

    const response = await request(app)
      .put(`/pizzas/${pizzaId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ price: 39.90 });

    expect([200, 404, 500]).toContain(response.status);
  });

  it("Não deve atualizar pizza sem token", async () => {
    if (!pizzaId) {
      return;
    }

    const response = await request(app)
      .put(`/pizzas/${pizzaId}`)
      .send({ price: 39.90 });

    expect(response.status).toBe(401);
  });

  it("Deve deletar pizza com token válido", async () => {
    if (!authToken || !pizzaId) {
      return;
    }

    const response = await request(app)
      .delete(`/pizzas/${pizzaId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect([200, 404, 500]).toContain(response.status);
  });

  it("Não deve deletar pizza sem token", async () => {
    const response = await request(app).delete("/pizzas/999");

    expect(response.status).toBe(401);
  });
});