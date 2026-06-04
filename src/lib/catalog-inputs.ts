import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published"]);

const baseProductSchema = z.object({
  title: z.string().trim().min(2, "标题至少 2 个字符").max(80, "标题最多 80 个字符"),
  description: z
    .string()
    .trim()
    .min(10, "描述至少 10 个字符")
    .max(1000, "描述最多 1000 个字符"),
  price: z.coerce.number().int().min(100, "价格至少 100 分"),
  inventory: z.coerce.number().int().min(0, "库存不能为负数"),
  status: productStatusSchema,
  featured: z.boolean().default(false),
});

export const createProductInputSchema = baseProductSchema;
export const updateProductInputSchema = baseProductSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "至少传入一个更新字段",
);

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

function toStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function toBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export function parseCreateProductFormData(formData: FormData) {
  return createProductInputSchema.parse({
    title: toStringValue(formData.get("title")),
    description: toStringValue(formData.get("description")),
    price: toStringValue(formData.get("price")),
    inventory: toStringValue(formData.get("inventory")),
    status: toStringValue(formData.get("status")),
    featured: toBoolean(formData.get("featured")),
  });
}

export function parseUpdateProductFormData(formData: FormData) {
  return parseCreateProductFormData(formData);
}

export function parseCreateProductJson(payload: unknown) {
  return createProductInputSchema.parse(payload);
}

export function parseUpdateProductJson(payload: unknown) {
  return updateProductInputSchema.parse(payload);
}
