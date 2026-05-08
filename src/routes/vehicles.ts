import type { FastifyInstance } from "fastify";
import { getUserVehiclesController } from "../controllers/vehicle-controller";
import { authenticate } from "../middleware/auth";

export default async function vehiclesRoutes(app: FastifyInstance) {
	app.get(
		"/bem/vehicles",
		{ preHandler: authenticate },
		getUserVehiclesController,
	);
}
