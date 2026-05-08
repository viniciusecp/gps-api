import type { FastifyRequest, FastifyReply } from "fastify";
import type { BemService } from "../services/bem-service";

export async function getUserVehiclesController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const user = request.user as { id: number; email: string } | undefined;
	if (!user?.id) {
		return reply.status(401).send({ error: "Usuário não autenticado" });
	}

	const bemService = request.server.bemService as BemService;
	const vehicles = await bemService.getUserVehicles(user.id);
	return reply.send(vehicles);
}
