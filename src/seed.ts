import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Pizza } from "./entity/Pizza";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado ao banco de dados!");

    const userRepository = AppDataSource.getRepository(User);
    const pizzaRepository = AppDataSource.getRepository(Pizza);

    // Verificar se já existe dados
    const userCount = await userRepository.count();
    if (userCount > 0) {
      console.log("Banco já contém dados. Pulando seed...");
      await AppDataSource.destroy();
      return;
    }

    // Criar usuário admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = userRepository.create({
      name: "Admin",
      email: "admin@pizzaria.com",
      password: adminPassword,
      phone: "11999999999",
      address: "Rua Admin, 1"
    });
    await userRepository.save(admin);
    console.log("Usuário admin criado!");

    // Criar usuário cliente
    const clientPassword = await bcrypt.hash("123456", 10);
    const client = userRepository.create({
      name: "Maria Silva",
      email: "maria@example.com",
      password: clientPassword,
      phone: "11988888888",
      address: "Rua das Flores, 456"
    });
    await userRepository.save(client);
    console.log("Usuário cliente criado!");

    // Criar pizzas
    const pizzas = [
      {
        name: "Margherita",
        description: "Molho de tomate, mussarela, manjericão e azeite",
        price: 35.90,
        available: true
      },
      {
        name: "Calabresa",
        description: "Calabresa, cebola, mussarela e azeitonas",
        price: 38.90,
        available: true
      },
      {
        name: "Portuguesa",
        description: "Presunto, ovos, cebola, mussarela, azeitonas e ervilha",
        price: 42.90,
        available: true
      },
      {
        name: "4 Queijos",
        description: "Mussarela, provolone, parmesão e gorgonzola",
        price: 45.90,
        available: true
      },
      {
        name: "Frango Catupiry",
        description: "Frango desfiado, catupiry e mussarela",
        price: 39.90,
        available: true
      },
      {
        name: "Napolitana",
        description: "Mussarela, tomate e parmesão",
        price: 37.90,
        available: true
      },
      {
        name: "Pepperoni",
        description: "Pepperoni e mussarela",
        price: 44.90,
        available: true
      },
      {
        name: "Vegetariana",
        description: "Tomate, pimentão, cebola, azeitona, palmito e mussarela",
        price: 40.90,
        available: true
      }
    ];

    for (const pizzaData of pizzas) {
      const pizza = pizzaRepository.create(pizzaData);
      await pizzaRepository.save(pizza);
    }
    console.log("Pizzas criadas!");

    console.log("\nSeed concluído com sucesso!");
    console.log("\nCredenciais de acesso:");
    console.log("   Email: admin@pizzaria.com");
    console.log("   Senha: admin123");

    await AppDataSource.destroy();
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();