import type { FastifyInstance } from "fastify";
import { getCoordinates, getHistoryController } from "../controllers/gps-controller";
import { authenticate } from "../middleware/auth";
import { validateParams, validateQuery } from "../middleware/validation";
import { getCoordinatesSchema, historyParamsSchema, historyQuerySchema } from "../validators/coordinates";

export default async function gprmcRoutes(app: FastifyInstance) {
	app.get(
		"/gprmc/coordinates/:imei",
		{ preHandler: authenticate, preValidation: validateParams(getCoordinatesSchema) },
		getCoordinates,
	);
	app.get(
		"/gprmc/history/:imei",
		{ preHandler: authenticate, preValidation: [validateParams(historyParamsSchema), validateQuery(historyQuerySchema)] },
		getHistoryController,
	);
}
