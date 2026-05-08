import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../errors/AppError";

export async function registerErrorHandler(app: FastifyInstance) {
	app.setErrorHandler((_error: Error & { statusCode?: number; validation?: unknown }, _request: FastifyRequest, _reply: FastifyReply) => {
		const statusCode = _error.statusCode || 500;

		// Handle Fastify validation errors (from schema validation)
		if ("validation" in _error && _error.validation) {
			return _reply.status(400).send({
				error: "Validation error",
				details: _error.validation,
			});
		}

		// Handle AppError with validation details
		if (_error instanceof AppError && _error.details) {
			return _reply.status(_error.statusCode).send({
				error: _error.message,
				details: _error.details,
			});
		}

		// Handle 401 Unauthorized
		if (statusCode === 401) {
			return _reply
				.status(401)
				.headers({ "WWW-Authenticate": "Bearer" })
				.send({ error: "Unauthorized - Invalid or expired token" });
		}

		// Handle 403 Forbidden
		if (statusCode === 403) {
			return _reply
				.status(403)
				.send({ error: "Forbidden - Insufficient permissions" });
		}

		// Log error for server errors
		_request.log.error(_error);

		// Generic error response
		_reply.status(statusCode).send({
			error: _error.message || "Internal server error",
		});
	});
}
