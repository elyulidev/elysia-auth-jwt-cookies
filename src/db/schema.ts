// src/database/schema.ts

import { createId } from "@paralleldrive/cuid2";
import {
	boolean,
	pgEnum,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const pgRole = pgEnum("role", ["ADMIN", "USER"]);

export const user = pgTable("user", {
	id: varchar("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	email: varchar("email").notNull().unique(),
	passwordHash: varchar("password_hash").notNull(),
	role: pgRole("role").notNull().default("USER"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela para armazenar refresh tokens emitidos (permite revogar)
export const refreshToken = pgTable("refresh_token", {
	id: varchar("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: varchar("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" })
		.unique(),
	token: varchar("token").notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	revoked: boolean("revoked").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

//Tabela para armazenar a lista de tarefas
export const task = pgTable("task", {
	id: varchar("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: varchar("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: varchar("title").notNull(),
	completed: boolean("completed").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const table = { user, refreshToken } as const;
