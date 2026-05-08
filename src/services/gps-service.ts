import { getDb } from "../db/connection";
import { gprmc, type Gprmc } from "../db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";

/**
 * Service for GPS-related operations (gprmc entity).
 */
export class GpsService {
	/**
	 * Get the last N coordinates for a given IMEI.
	 */
	async getLastCoordinates(imei: string, limit = 10): Promise<Gprmc[]> {
		const db = await getDb();
		return db
			.select()
			.from(gprmc)
			.where(eq(gprmc.imei, imei))
			.orderBy(desc(gprmc.id))
			.limit(limit);
	}

	/**
	 * Get history within a date range for a given IMEI.
	 */
	async getHistory(
		imei: string,
		dataInicio: string,
		horaInicio: string,
		dataFinal: string,
		horaFinal: string,
	): Promise<Gprmc[]> {
		const start = new Date(`${dataInicio}T${horaInicio}`);
		const end = new Date(`${dataFinal}T${horaFinal}`);
		// Adjust timezone (UTC-6)
		const adjustedStart = new Date(start.getTime() - 360 * 60000);
		const adjustedEnd = new Date(end.getTime() - 360 * 60000);

		const db = await getDb();
		return db
			.select()
			.from(gprmc)
			.where(
				and(
					eq(gprmc.imei, imei),
					gte(gprmc.date, adjustedStart),
					lte(gprmc.date, adjustedEnd),
				),
			)
			.orderBy(desc(gprmc.date));
	}
}
