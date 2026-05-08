import {
	mysqlTable,
	int,
	varchar,
	text,
	char,
	date,
	datetime,
	float,
} from "drizzle-orm/mysql-core";

export const cliente = mysqlTable("cliente", {
	id: int("id").primaryKey(),
	email: varchar("email", { length: 255 }),
	nome: varchar("nome", { length: 255 }),
	apelido: varchar("apelido", { length: 255 }),
	senha: text("senha"),
	ativo: char("ativo", { length: 1 }),
	data_inativacao: date("data_inativacao"),
	observacao: text("observacao"),
	master: char("master", { length: 1 }),
	admin: char("admin", { length: 1 }),
	id_admin: int("id_admin"),
});

export const bem = mysqlTable("bem", {
	id: int("id").primaryKey(),
	imei: varchar("imei", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }),
	date: datetime("date").notNull(),
	identificacao: varchar("identificacao", { length: 255 }),
	cliente: int("cliente"),
	activated: char("activated", { length: 1 }),
	modo_operacao: varchar("modo_operacao", { length: 255 }),
	porta: int("porta"),
	liberado: char("liberado", { length: 1 }),
	status_sinal: char("status_sinal", { length: 1 }),
	cor_grafico: char("cor_grafico", { length: 1 }),
	id_admin: int("id_admin"),
});

export const gprmc = mysqlTable("gprmc", {
	id: int("id").primaryKey(),
	date: datetime("date"),
	imei: varchar("imei", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 255 }),
	satelliteFixStatus: char("satelliteFixStatus", { length: 1 }),
	latitudeDecimalDegrees: varchar("latitudeDecimalDegrees", {
		length: 255,
	}).notNull(),
	latitudeHemisphere: char("latitudeHemisphere", { length: 1 }).notNull(),
	longitudeDecimalDegrees: varchar("longitudeDecimalDegrees", {
		length: 255,
	}).notNull(),
	longitudeHemisphere: char("longitudeHemisphere", { length: 1 }).notNull(),
	speed: float("speed").notNull(),
	gpsSignalIndicator: char("gpsSignalIndicator", { length: 1 }),
	infotext: text("infotext"),
	address: text("address"),
});

export type Cliente = typeof cliente.$inferSelect;
export type Bem = typeof bem.$inferSelect;
export type Gprmc = typeof gprmc.$inferSelect;
