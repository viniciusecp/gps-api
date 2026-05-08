import type { FastifyRequest, FastifyReply } from "fastify";
import { type AnyZodObject, ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function validateBody(schema: AnyZodObject) {
	return async (request: FastifyRequest, _reply: FastifyReply) => {
		try {
			await schema.parseAsync(request.body);
		} catch (err) {
			if (err instanceof ZodError) {
				const details = err.errors.map((e) => ({
					field: e.path.join("."),
					message: e.message,
				}));
				throw new AppError("Validation failed", 400, true, details);
			}
			throw err;
		}
	};
}

export function validateQuery(schema: AnyZodObject) {
	return async (request: FastifyRequest, _reply: FastifyReply) => {
		try {
			await schema.parseAsync(request.query);
		} catch (err) {
			if (err instanceof ZodError) {
				const details = err.errors.map((e) => ({
					field: e.path.join("."),
					message: e.message,
				}));
				throw new AppError("Validation failed", 400, true, details);
			}
			throw err;
		}
	};
}

export function validateParams(schema: AnyZodObject) {
	return async (request: FastifyRequest, _reply: FastifyReply) => {
		try {
			await schema.parseAsync(request.params);
		} catch (err) {
			if (err instanceof ZodError) {
				const details = err.errors.map((e) => ({
					field: e.path.join("."),
					message: e.message,
				}));
				throw new AppError("Validation failed", 400, true, details);
			}
			throw err;
		}
	};
}
