# Pedido Tracker

Sistema web para gerenciamento e acompanhamento de pedidos.

A aplicação possui autenticação de usuários, criação e gerenciamento de pedidos e acompanhamento do status de cada pedido, com uma interface responsiva e identidade visual própria.

---

## 📸 Screenshots

### Login

![Tela de Login](/screenshots/login.png)

### Cadastro

![Tela de Cadastro](/screenshots/cadastro.png)

### Dashboard

![Dashboard](/screenshots/dashboard.png)

### Pedidos

![Tela de Pedidos](/screenshots/pedidos.png)

### Detalhes do pedido

![Detalhes do Pedido](/screenshots/detalhes-pedido.png)

### Inserir novo pedido

![Detalhes do Pedido](/screenshots/novo-pedido.png)

> As imagens acima representam as principais telas da aplicação em funcionamento.

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de demonstrar conhecimentos em desenvolvimento **Full Stack**, integração entre frontend e backend, autenticação, persistência de dados, criação de APIs REST e desenvolvimento de interfaces modernas.

---

## 🚀 Funcionalidades

* Cadastro de usuários
* Login com autenticação
* Autenticação utilizando JWT
* Criptografia de senhas com BCrypt
* Criação de pedidos
* Listagem de pedidos
* Visualização dos detalhes dos pedidos
* Atualização do status dos pedidos
* Itens vinculados aos pedidos
* Endereço de entrega
* Tratamento de erros da API
* Validação dos dados enviados para o backend
* Proteção das rotas autenticadas
* Interface responsiva
* Integração entre frontend e backend através de API REST

---

## 🛠️ Tecnologias utilizadas

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT
* BCrypt
* Maven
* Bean Validation
* SQLite

### Frontend

* React
* Vite
* React Router
* Axios
* Material UI (MUI)
* JavaScript

---

## 🏗️ Arquitetura

O projeto está dividido em duas aplicações principais:

```text
pedido-tracker/
│
├── backend/
│   └── API REST desenvolvida com Spring Boot
│
├── frontend/
│   └── Interface desenvolvida com React + Vite
│
└── screenshots/
    └── Imagens utilizadas neste README
```

### Backend

O backend segue uma organização baseada em responsabilidades:

```text
controller
dto
exception
model
repository
security
service
```

Essa divisão facilita a manutenção, organização e evolução da aplicação.

### Frontend

O frontend possui componentes e páginas separados por responsabilidade, além de um contexto de autenticação para gerenciamento da sessão do usuário.

---

## 🔐 Autenticação

A autenticação da aplicação utiliza **JWT (JSON Web Token)**.

Após o login, o backend gera um token que é utilizado nas requisições para os endpoints protegidos.

O frontend armazena o token e o envia automaticamente através do header:

```text
Authorization: Bearer <token>
```

As senhas dos usuários são armazenadas utilizando **BCrypt**.

---

## 📦 Estrutura dos pedidos

Cada pedido possui informações como:

* ID
* Cliente
* Endereço de entrega
* Status
* Itens do pedido
* Quantidade de cada item

Os pedidos possuem diferentes estados para representar o andamento da entrega.

---

## 🔄 Comunicação entre Frontend e Backend

O frontend realiza as requisições para a API REST utilizando Axios.

A API possui como endereço base durante o desenvolvimento:

```text
http://localhost:8080/api
```

O frontend é executado através do Vite.

---

## ▶️ Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Java
* Maven
* Node.js
* npm

### Backend

Entre na pasta:

```bash
cd backend
```

Execute:

```bash
./mvnw spring-boot:run
```

No Windows, também pode ser utilizado:

```powershell
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em:

```text
http://localhost:8080
```

### Frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O Vite disponibilizará a aplicação no endereço indicado pelo terminal, normalmente:

```text
http://localhost:5173
```

---

## 🧪 Testes da API

Durante o desenvolvimento, os principais endpoints foram testados diretamente através do terminal, incluindo:

* Cadastro
* Login
* Autenticação JWT
* Criação de pedidos
* Listagem de pedidos
* Atualização de pedidos
* Validação de acesso às rotas protegidas

Exemplo de requisição autenticada:

```http
GET /api/orders
Authorization: Bearer <token>
```

---

## 📌 Endpoints principais

### Autenticação

```text
POST /api/auth/register
POST /api/auth/login
```

### Pedidos

```text
GET    /api/orders
POST   /api/orders
PUT    /api/orders/{id}/status
GET    /api/orders/{id}
```

As rotas de pedidos são protegidas por autenticação.

---

## 🎨 Identidade visual

A aplicação possui uma identidade visual própria, utilizando principalmente:

* Fundo escuro
* Laranja como cor de destaque
* Interface minimalista
* Contraste elevado
* Componentes baseados em Material UI

A identidade foi aplicada às telas de autenticação, navegação e gerenciamento dos pedidos.

---

## 🔗 Repositório

O código-fonte completo do projeto está disponível no GitHub:

**https://github.com/JessicaLyra/pedido-tracker**

---

## 👩‍💻 Desenvolvedora

**Jéssica Lyra**

Desenvolvedora Web com experiência em criação de aplicações, sites e soluções digitais, com atuação em desenvolvimento frontend, backend e WordPress.
