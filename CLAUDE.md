# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Monorepo containing the GPS tracking API backend (server/) and a future Expo mobile app (app/). The backend receives vehicle coordinates from tracking devices and serves data to the RastroApp mobile application.

## Monorepo Structure

```
gps-api/
  package.json           # Root workspace config
  pnpm-workspace.yaml   # Workspace definition
  server/               # Backend (Fastify + Drizzle ORM + TypeScript)
    package.json
    tsconfig.json
    drizzle.config.ts
    biome.json
    .env
    src/
      index.ts                  # Entry point: creates app, listens on port 3333
      app.ts                    # Fastify app setup: registers JWT, routes, authenticate decorator
      db/
        connection.ts           # Drizzle MySQL connection via mysql2
        schema.ts               # Tables: cliente, bem, gprmc (Drizzle ORM definitions)
      routes/
        auth.ts                 # Auth routes: /api/cliente/login, /api/cliente/refresh
        coordinates.ts          # GPS routes: /api/gprmc/coordinates/:imei, /api/gprmc/history/:imei
        vehicles.ts             # Vehicle routes: /api/bem/vehicles (auth required)
      controllers/
        auth-controller.ts     # Login (JWT access + refresh)
        gps-controller.ts      # Get last coordinates, get history by date range (gprmc entity)
        vehicle-controller.ts  # Get user vehicles (bem entity)
      services/
        auth-service.ts         # Cliente operations: authenticate
        gps-service.ts         # Gprmc operations: query coordinates, history
        bem-service.ts         # Bem operations: get vehicles by cliente ID
      repositories/
        cliente-repository.ts  # Cliente DB queries
        gprmc-repository.ts   # Gprmc DB queries
        bem-repository.ts     # Bem DB queries
      utils/
        coordinates.ts         # Convert GPRS (DDMM.MMMM) to decimal degrees
      validators/
        schemas.ts             # Zod schemas: login, refresh
        coordinates.ts         # Zod schemas: getCoordinates, getHistory
      middleware/
        auth.ts                # authenticate decorator: JWT verification
      errors/
        AppError.ts            # Custom error class
      middleware/
        errorHandler.ts        # Global error handler
        validation.ts         # Request validation middleware
  app/                   # Future Expo mobile app (empty for now)
```

## Tech Stack (Server)

- **Runtime**: Node.js
- **Framework**: Fastify 5.x
- **ORM**: Drizzle ORM with MySQL (mysql2 driver)
- **Database**: MySQL (database: `tracker`, user: `root`, password: `root`, host: `localhost`)
- **Authentication**: JWT (@fastify/jwt) + MD5 password hashing (legacy compatibility)
- **Validation**: Zod
- **Language**: TypeScript
- **Package Manager**: pnpm (workspace)

## Development Commands

### Server
```bash
cd server
pnpm dev          # Start with tsx watch on port 3333
pnpm build        # Compile TypeScript to dist/
pnpm start        # Run compiled dist/index.js
pnpm db:generate # Generate migrations with drizzle-kit
pnpm db:push     # Push schema changes to DB
pnpm lint        # Lint with Biome
pnpm lint:fix    # Fix linting issues
```

No test framework is configured.

## API Endpoints (Server)

All routes prefixed with `/api`:

| Method | Path | Auth | Entity | Description |
|--------|------|------|---------|-------------|
| POST | `/cliente/login` | No | cliente | Login with email/apelido + senha, returns user + access/refresh tokens |
| POST | `/cliente/refresh` | No | cliente | Refresh access token using refresh token |
| GET | `/gprmc/coordinates/:imei` | Yes | gprmc | Last 10 GPS coordinates for a vehicle |
| GET | `/gprmc/history/:imei` | Yes | gprmc | Historical GPS data by date range |
| GET | `/bem/vehicles` | Yes | bem | List vehicles for authenticated user |

## Key Implementation Details

- **Coordinate conversion**: GPRS format (DDMM.MMMM) converted to decimal degrees (DD + MM/60). Handles 9-digit latitude/longitude by prepending "0". Southern hemisphere values negated.
- **Timezone**: Dates adjusted by `360 * 60000` ms (UTC-6). See `server/src/services/gps-service.ts`.
- **Speed**: Converted from km/h to mph (* 1.60934).
- **JWT auth**: Access token (15min), refresh token (7d). Secret via `JWT_SECRET` env var.
- **Password hashing**: MD5 (via crypto module) for legacy compatibility with existing cliente table.
- **DB schema**: Tables defined with Drizzle ORM in `server/src/db/schema.ts`. Use `drizzle-kit` for migrations.
- **TypeScript**: Strict mode enabled. Drizzle types inferred via `$inferSelect`.
