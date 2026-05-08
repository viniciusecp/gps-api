import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, "Email ou apelido obrigatório"),
	senha: z.string().min(1, "Senha obrigatória"),
});

export const refreshSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token obrigatório"),
});
