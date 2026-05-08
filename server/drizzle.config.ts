import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "mysql",
	dbCredentials: {
		url: `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASS || "root"}@${process.env.DB_HOST || "localhost"}:3306/${process.env.DB_NAME || "tracker"}`,
	},
} satisfies Config;
