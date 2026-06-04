import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { productsTable, usersTable } from "@/db/schema";
import { databaseFilePath } from "@/lib/env";

const dataDir = path.dirname(databaseFilePath);
fs.mkdirSync(dataDir, { recursive: true });

export const sqlite = new Database(databaseFilePath);
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite, { schema: { productsTable, usersTable } });

const seedProducts = [
  {
    id: "prod_starter_01",
    title: "晨雾手冲礼盒",
    slug: "morning-brew-kit",
    description:
      "为独立品牌搭建的首发商品示例，适合展示单体全栈架构下的商品详情、库存与发布状态。",
    price: 19900,
    inventory: 32,
    status: "published",
    featured: true,
  },
  {
    id: "prod_starter_02",
    title: "铜色桌面收纳架",
    slug: "copper-desk-rack",
    description:
      "带有温暖金属质感的家居单品，用来演示首页精选模块和后台编辑流程。",
    price: 25900,
    inventory: 18,
    status: "published",
    featured: true,
  },
  {
    id: "prod_starter_03",
    title: "夜航帆布托特包",
    slug: "night-sail-tote",
    description:
      "草稿态商品样例，适合测试 Medusa Workflow 驱动的上下架、编辑与删除动作。",
    price: 14900,
    inventory: 7,
    status: "draft",
    featured: false,
  },
];

let isReady = false;

export function ensureDbReady() {
  if (isReady) {
    return;
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      inventory INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published')),
      featured INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      union_id TEXT NOT NULL UNIQUE,
      open_id TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      mobile TEXT,
      email TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  const existing = sqlite
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get() as { count: number };

  if (existing.count === 0) {
    const insert = sqlite.prepare(`
      INSERT INTO products (
        id, title, slug, description, price, inventory, status, featured, created_at, updated_at
      ) VALUES (
        @id, @title, @slug, @description, @price, @inventory, @status, @featured, @createdAt, @updatedAt
      )
    `);

    const now = Date.now();

    const seed = sqlite.transaction(() => {
      for (const product of seedProducts) {
        insert.run({
          ...product,
          featured: product.featured ? 1 : 0,
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    seed();
  }

  isReady = true;
}
