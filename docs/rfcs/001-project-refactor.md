Preciso refatorar todo esse projeto. Essa é uma api que consome os dados de um banco de dados de um sistema de rastreamento veicular, ou seja, essa api faz autenticação no banco já existente e pega os dados necessários.
Essa api foi implementada a muito tempo, sem estrutura, nem arquitura adequada. Quero recriar essa api utilizando as novas praticas do mercado, ou seja, quero continuar usando node, mas quero passar a usar pnpm, fastify, zod, moderno framework para conexão ao banco de dados, etc. E obviamente reestruturado as pastas, para uma arquitetura moderna e escalável, autenticação com token, etc.
Como o banco se manterá o mesmo, tabelas/colunas se mantém as mesmas.
Precisamos manter apenas as três rotas principais: /getcoordinates/:imei e /gethistory/:imei. Obviamente precisaremos de novas rotas para gerenciamento de autenticação, etc.

---

# Plano de Refatoração GPS API

## Contexto

API Node.js/Express antiga (Express 4.x, Sequelize 4.x, npm) consome banco MySQL existente (`tracker`). Código sem estrutura, auth MD5 insegura, validação fraca. Objetivo: modernizar stack mantendo mesmas tabelas e 3 rotas principais.

## Stack Alvo

| Atual | Novo |
|-------|------|
| npm | pnpm |
| Express 4 | Fastify |
| Sequelize 4 | Drizzle ORM |
| express-validator | Zod |
| MD5 + senha por request | JWT (@fastify/jwt) |
| JS | TypeScript |
| Credenciais hardcoded | .env (dotenv) |

## Estrutura de Pastas Alvo

```
gps-api/
├── package.json          # pnpm
├── tsconfig.json
├── drizzle.config.ts     # Drizzle config
├── .env                  # Variáveis ambiente
├── src/
│   ├── index.ts          # Entry point
│   ├── app.ts            # Fastify instance + plugins
│   ├── routes/
│   │   ├── auth.ts           # POST /login, POST /refresh
│   │   ├── coordinates.ts    # POST /getcoordinates/:imei
│   │   └── history.ts       # POST /gethistory/:imei
│   ├── controllers/
│   │   ├── auth-controller.ts
│   │   └── gps-controller.ts
│   ├── services/
│   │   ├── auth-service.ts
│   │   └── gps-service.ts
│   ├── db/
│   │   ├── schema.ts        # Drizzle schemas (cliente, bem, gprmc)
│   │   └── connection.ts    # mysql2 pool
│   ├── middleware/
│   │   └── auth.ts          # JWT verification
│   ├── validators/
│   │   └── schemas.ts       # Zod schemas
│   └── utils/
│       ├── coordinates.ts    # Conversão GPRS→decimal (portado de UserController.js:28-67)
│       └── date.ts          # Timezone offset (portado de UserController.js:35)
└── docs/
```

## Mapeamento de Funcionalidades

### Auth (novo fluxo JWT)
- `POST /login` → email/apelido + senha → JWT token
- **MD5 mantido**: senha chega plain, fazemos hash MD5 no service, comparamos com hash no banco (`cliente.senha`). Outro sistema legado ainda grava MD5 lá, não mudamos.
- `@fastify/jwt` gera token
- Middleware `auth.ts` valida token nas rotas GPS

### Rotas GPS (mantidas + protegidas)
- `POST /getcoordinates/:imei` → últimas 10 coordenadas (lógica de `UserController.js:110-133`)
- `POST /gethistory/:imei` → histórico por data (lógica de `UserController.js:135-184`)
- Body `email`/`senha` removidos → lidos do JWT

### Lógica Portada
- `convertCoordinates()` → `src/utils/coordinates.ts` (UserController.js:28-67)
- Timezone fixo UTC-6 → `src/utils/date.ts` (UserController.js:35)
- Velocidade km/h → mph → manter em `coordinates.ts`
- `userAuthentication()` → `src/services/auth-service.ts` (UserController.js:7-25)

### Schema Drizzle (banco existente)
```typescript
// cliente (User.js:3-22)
export const cliente = mysqlTable('cliente', { id, email, nome, apelido, senha, ativo, ... })

// bem (Vehicles.js:3-18)
export const bem = mysqlTable('bem', { id, imei, name, cliente, ... })

// gprmc (Gprmc.js:3-18)
export const gprmc = mysqlTable('gprmc', { id, date, imei, latitudeDecimalDegrees, ... })
```

## Passos de Implementação

### 1. Setup inicial
- Init projeto pnpm, instalar deps (fastify, @fastify/jwt, drizzle-orm, mysql2, zod, dotenv, typescript, tsx)
- Criar `tsconfig.json`, `drizzle.config.ts`
- Criar `.env` com `DB_NAME=tracker`, `DB_USER=root`, `DB_PASS=root`, `DB_HOST=localhost`, `JWT_SECRET`

### 2. Connection + Schema
- `src/db/connection.ts` → mysql2 pool + Drizzle init
- `src/db/schema.ts` → definir 3 tabelas (portar colunas de `User.js`, `Vehicles.js`, `Gprmc.js`)

### 3. Utils
- `src/utils/coordinates.ts` → portar `convertCoordinates()` de `UserController.js:28-67`
- `src/utils/date.ts` → portar ajuste timezone de `UserController.js:35`

### 4. Validators (Zod)
- `src/validators/schemas.ts` → schemas para login, coordinates, history

### 5. Services
- `src/services/auth-service.ts` → `userAuthentication()` portada de `UserController.js:7-25`
- `src/services/gps-service.ts` → `getCoordinates()`, `getHistory()` queries via Drizzle

### 6. Controllers
- `src/controllers/auth-controller.ts` → login com JWT
- `src/controllers/gps-controller.ts` → coordenadas + histórico

### 7. Middleware
- `src/middleware/auth.ts` → verifica JWT via `@fastify/jwt`

### 8. Routes + App
- `src/routes/auth.ts`, `coordinates.ts`, `history.ts`
- `src/app.ts` → registra plugins, rotas
- `src/index.ts` → sobe servidor porta 3000

### 9. Remover arquivos antigos
- Após confirmar novo funciona: `server.js`, `src/` antigo, `package-lock.json`

## Verificação

1. `pnpm install` → sem erros
2. `pnpm dev` → servidor sobe na 3000
3. `POST /login` → retorna JWT
4. `POST /getcoordinates/:imei` com token → retorna coordenadas
5. `POST /gethistory/:imei` com token → retorna histórico
6. Requisição sem token → 401
