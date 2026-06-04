import "server-only";

import { and, desc, eq, like, or } from "drizzle-orm";

import { db, ensureDbReady } from "@/db";
import { productsTable, type NewProduct, type Product } from "@/db/schema";
import type {
  CreateProductInput,
  ProductStatus,
  UpdateProductInput,
} from "@/lib/catalog-inputs";
import { slugify } from "@/lib/slug";

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`找不到商品：${id}`);
    this.name = "ProductNotFoundError";
  }
}

export type ProductFilters = {
  query?: string;
  status?: ProductStatus | "all";
  featured?: boolean;
  limit?: number;
};

function resolveWhere(filters: ProductFilters) {
  const conditions = [];

  if (filters.query) {
    const keyword = `%${filters.query.trim()}%`;
    conditions.push(
      or(
        like(productsTable.title, keyword),
        like(productsTable.slug, keyword),
        like(productsTable.description, keyword),
      ),
    );
  }

  if (filters.status && filters.status !== "all") {
    conditions.push(eq(productsTable.status, filters.status));
  }

  if (typeof filters.featured === "boolean") {
    conditions.push(eq(productsTable.featured, filters.featured));
  }

  if (conditions.length === 0) {
    return undefined;
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return and(...conditions);
}

export function formatCurrency(price: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 2,
  }).format(price / 100);
}

export function listProducts(filters: ProductFilters = {}) {
  ensureDbReady();

  const where = resolveWhere(filters);
  const baseQuery = db.select().from(productsTable);
  const filteredQuery = where ? baseQuery.where(where) : baseQuery;
  const orderedQuery = filteredQuery.orderBy(desc(productsTable.updatedAt));

  return typeof filters.limit === "number"
    ? orderedQuery.limit(filters.limit).all()
    : orderedQuery.all();
}

export function getFeaturedProducts(limit = 3) {
  return listProducts({ featured: true, status: "published", limit });
}

export function getProductById(id: string) {
  ensureDbReady();
  return db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .get();
}

export function getProductBySlug(slug: string) {
  ensureDbReady();
  return db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug))
    .get();
}

export function createUniqueSlug(title: string, excludeId?: string) {
  ensureDbReady();

  const base = slugify(title);
  const similar = db
    .select({ id: productsTable.id, slug: productsTable.slug })
    .from(productsTable)
    .where(like(productsTable.slug, `${base}%`))
    .all();

  const used = new Set(
    similar.filter((item) => item.id !== excludeId).map((item) => item.slug),
  );

  let candidate = base;
  let counter = 2;

  while (used.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export function buildNewProduct(input: CreateProductInput): NewProduct {
  const timestamp = Date.now();

  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    slug: createUniqueSlug(input.title),
    description: input.description.trim(),
    price: input.price,
    inventory: input.inventory,
    status: input.status,
    featured: input.featured,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createProductRecord(input: CreateProductInput) {
  ensureDbReady();
  const product = buildNewProduct(input);
  db.insert(productsTable).values(product).run();
  return product;
}

export function updateProductRecord(id: string, input: UpdateProductInput) {
  ensureDbReady();

  const existing = getProductById(id);

  if (!existing) {
    throw new ProductNotFoundError(id);
  }

  const nextTitle = input.title?.trim() ?? existing.title;
  const nextProduct: Product = {
    ...existing,
    title: nextTitle,
    slug:
      input.title && input.title.trim() !== existing.title
        ? createUniqueSlug(input.title, id)
        : existing.slug,
    description: input.description?.trim() ?? existing.description,
    price: input.price ?? existing.price,
    inventory: input.inventory ?? existing.inventory,
    status: input.status ?? existing.status,
    featured: input.featured ?? existing.featured,
    updatedAt: Date.now(),
  };

  db.update(productsTable)
    .set({
      title: nextProduct.title,
      slug: nextProduct.slug,
      description: nextProduct.description,
      price: nextProduct.price,
      inventory: nextProduct.inventory,
      status: nextProduct.status,
      featured: nextProduct.featured,
      updatedAt: nextProduct.updatedAt,
    })
    .where(eq(productsTable.id, id))
    .run();

  return {
    previous: existing,
    current: nextProduct,
  };
}

export function restoreProductRecord(product: Product) {
  ensureDbReady();
  db
    .insert(productsTable)
    .values(product)
    .onConflictDoUpdate({
      target: productsTable.id,
      set: product,
    })
    .run();

  return product;
}

export function deleteProductRecord(id: string) {
  ensureDbReady();
  const existing = getProductById(id);

  if (!existing) {
    throw new ProductNotFoundError(id);
  }

  db.delete(productsTable).where(eq(productsTable.id, id)).run();
  return existing;
}

export function getDashboardStats() {
  const products = listProducts();

  const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);
  const publishedCount = products.filter(
    (product) => product.status === "published",
  ).length;
  const featuredCount = products.filter((product) => product.featured).length;
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.inventory * product.price,
    0,
  );

  return {
    productCount: products.length,
    publishedCount,
    featuredCount,
    totalInventory,
    inventoryValue,
  };
}
