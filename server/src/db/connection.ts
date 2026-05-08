import { createConnection, type Connection } from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";

let connection: Connection | null = null;
let db: MySql2Database<typeof schema> | null = null;

export async function getConnection() {
	if (!connection) {
		connection = await createConnection({
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASS || "root",
			database: process.env.DB_NAME || "tracker",
		});
	}
	return connection;
}

export async function getDb() {
	if (!db) {
		const conn = await getConnection();
		db = drizzle(conn, { schema, mode: "default" });
	}
	return db;
}
