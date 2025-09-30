# API de Pizzaria 🍕

RESTful API para gerenciar usuários, pizzas e pedidos de uma pizzaria, construída com TypeScript, TypeORM e autenticação JWT.
Esta API possui endpoints protegidos por JWT, testes automatizados e persistência com relacionamentos entre entidades.

# Requisitos Atendidos 

- CRUD (Create, Read, Update, Delete) completo de - usuários, pizzas e pedidos.
- Autenticação JWT (JSON Web Token).
- Endpoints protegidos por token (métodos POST, PUT, DELETE).
- Endpoints abertos (métodos GET e Login).
- Testes automatizados com Jest e Supertest.
- Persistência de dados com TypeORM e banco de dados SQLite.

## Tecnologias utilizadas

- Node.js + TypeScript

- Express

- TypeORM

- SQLite (banco portátil, zero configuração)

- JSON Web Token (JWT)

- bcryptjs

- Jest + Supertest

## Estrutura do projeto

```text
Pizzaria/
├── src/
│ ├── controllers/
│ │ ├── UserController.ts
│ │ ├── PizzaController.ts
│ │ └── OrderController.ts
│ ├── entity/
│ │ ├── User.ts
│ │ ├── Pizza.ts
│ │ ├── Order.ts
│ │ └── OrderItem.ts
│ ├── routes/
│ │ ├── user.routes.ts
│ │ ├── pizza.routes.ts
│ │ ├── order.routes.ts
│ │ └── index.ts
│ ├── middleware/
│ │ └── auth.ts
│ ├── tests/
│ │ ├── auth.test.ts
│ │ ├── pizza.test.ts
│ │ └── order.test.ts
│ ├── data-source.ts
│ ├── seed.ts
│ ├── server.ts
│ └── test-helper.ts
├── .env
├── package.json
├── tsconfig.json
├── jest.config.js
├── PostManRequests.json
└── README.md
```

## Instalação e Configuração

### 1. Inicializar o projeto
Clone o repositório para sua máquina

```bash
git clone https://github.com/Pauloohg/API-Pizzaria.git
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie e edite o arquivo .env:
```env
JWT_SECRET=seu_secret_aqui

JWT_EXPIRES_IN=24h

PORT=3000
```

### 4. Popular o banco de dados

```bash
npm run seed
```
Isso irá:
- Criar o arquivo database.sqlite
- Criar todas as tabelas do projeto
- Criar usuário admin: admin@pizzaria.com/admin123
- Criar usuário cliente: maria@example.com/123456

Criar 8 pizzas iniciais no cardápio

### 5. Executar o projeto

```bash
npm run dev
    ou
npm start
```
O servidor será iniciado em http://localhost:3000.

### 6. Executar testes automatizados

```bash
npm test
```

## Autenticação

O login gera um JWT que deve ser enviado no header Authorization para acessar endpoints protegidos.

#### Formato do header:

```http
Authorization: Bearer <TOKEN>
```
>O token expira conforme a variável JWT_EXPIRES_IN configurada no .env (ex.: 24h)..


## Endpoints principais
#### Auth

- POST /login → Retorna token JWT e dados do usuário

#### Users

- GET /users → Listar todos os usuários (aberto)

- GET /users/:id → Buscar usuário por ID (aberto)

- POST /users → Criar usuário (protegido)

- PUT /users/:id → Atualizar usuário (protegido)

- DELETE /users/:id → Deletar usuário (protegido)

#### Pizzas

- GET /pizzas → Listar todas as pizzas (aberto)

- GET /pizzas/:id → Buscar pizza por ID (aberto)

- POST /pizzas → Criar pizza (protegido)

- PUT /pizzas/:id → Atualizar pizza (protegido)

- DELETE /pizzas/:id → Deletar pizza (protegido)

#### Orders

- GET /orders → Listar todos os pedidos (aberto)

- GET /orders/:id → Buscar pedido por ID (aberto)

- POST /orders → Criar pedido (protegido)

- PUT /orders/:id → Atualizar status do pedido (protegido)

- DELETE /orders/:id → Deletar pedido (protegido)
