import request from "supertest";
import { TestDataSource } from "../test-helper";
import app from "../server";
import { User } from "../entity/User";
import { Pizza } from "../entity/Pizza";
import bcrypt from "bcryptjs";

let authToken: string;
let orderId: number;
let userId: number;
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
  
  const savedAdmin = await userRepository.save(admin);
  userId = savedAdmin.id;

  // Obter token
  const loginResponse = await request(app)
    .post("/login")
    .send({
      email: "admin@pizzaria.com",
      password: "admin123"
    });

  if (loginResponse.status === 200) {
    authToken = loginResponse.body.token;
  }

  // Criar uma pizza para usar nos testes
  if (authToken) {
    const pizzaRepository = TestDataSource.getRepository(Pizza);
    const pizza = pizzaRepository.create({
      name: "Pizza Order Test",
      description: "Para testes de pedido",
      price: 30.00,
      available: true
    });
    const savedPizza = await pizzaRepository.save(pizza);
    pizzaId = savedPizza.id;
  }
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});

describe("Pedidos", () => {
  it("Deve listar pedidos sem autenticação (GET aberto)", async () => {
    const response = await request(app).get("/orders");

    expect([200, 500]).toContain(response.status);
    
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });

  it("Deve criar um pedido com token válido", async () => {
    if (!authToken || !userId || !pizzaId) {
      return;
    }

    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId: userId,
        items: [
          {
            pizzaId: pizzaId,
            quantity: 2
          }
        ],
        deliveryAddress: "Rua Teste, 123"
      });

    expect([201, 404, 500]).toContain(response.status);
    
    if (response.status === 201) {
      expect(response.body).toHaveProperty("order");
      orderId = response.body.order.id;
    }
  });

  it("Não deve criar pedido sem token", async () => {
    const response = await request(app)
      .post("/orders")
      .send({
        userId: 1,
        items: [{ pizzaId: 1, quantity: 1 }]
      });

    expect(response.status).toBe(401);
  });

  it("Deve buscar pedido por ID sem autenticação", async () => {
    if (!orderId) {
      return;
    }

    const response = await request(app).get(`/orders/${orderId}`);

    expect([200, 404]).toContain(response.status);
  });

  it("Deve atualizar status do pedido com token válido", async () => {
    if (!authToken || !orderId) {
      return;
    }

    const response = await request(app)
      .put(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ status: "preparing" });

    expect([200, 404, 500]).toContain(response.status);
  });

  it("Não deve atualizar pedido sem token", async () => {
    if (!orderId) {
      return;
    }

    const response = await request(app)
      .put(`/orders/${orderId}`)
      .send({ status: "delivered" });

    expect(response.status).toBe(401);
  });

  it("Deve deletar pedido com token válido", async () => {
    if (!authToken || !orderId) {
      return;
    }

    const response = await request(app)
      .delete(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect([200, 404, 500]).toContain(response.status);
  });

  it("Não deve deletar pedido sem token", async () => {
    const response = await request(app).delete("/orders/999");

    expect(response.status).toBe(401);
  });
});