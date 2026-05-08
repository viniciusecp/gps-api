import { z } from "zod";

export const getCoordinatesSchema = z.object({
	imei: z.string().length(15, "IMEI deve ter 15 dígitos"),
});

export const historyParamsSchema = z.object({
	imei: z.string().length(15, "IMEI deve ter 15 dígitos"),
});

export const historyQuerySchema = z.object({
	dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inicial inválida (YYYY-MM-DD)"),
	horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Hora inicial inválida (HH:MM)"),
	dataFinal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data final inválida (YYYY-MM-DD)"),
	horaFinal: z.string().regex(/^\d{2}:\d{2}$/, "Hora final inválida (HH:MM)"),
});
