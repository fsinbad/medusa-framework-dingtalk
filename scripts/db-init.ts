import { sql } from "drizzle-orm";

import { db, ensureDbReady } from "../src/db";
import { productsTable } from "../src/db/schema";
import { databaseFileLabel, databaseFilePath } from "../src/lib/env";

ensureDbReady();

const row = db
	.select({ count: sql<number>`count(*)` })
	.from(productsTable)
	.get();

console.log(`✅ SQLite ready: ${databaseFileLabel}`);
console.log(`📁 Path: ${databaseFilePath}`);
console.log(`📦 Seeded products: ${row?.count ?? 0}`);
