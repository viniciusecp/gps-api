import type { FastifyInstance } from "fastify";
import { login, refreshToken } from "../controllers/auth-controller";
import { validateBody } from "../middleware/validation";
import { loginSchema, refreshSchema } from "../validators/schemas";

export default async function authRoutes(app: FastifyInstance) {
	app.post("/cliente/login", { preValidation: validateBody(loginSchema) }, login);
	app.post("/cliente/refresh", { preValidation: validateBody(refreshSchema) }, refreshToken);
}
