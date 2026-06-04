"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
	parseCreateProductFormData,
	parseUpdateProductFormData,
	productStatusSchema,
} from "@/lib/catalog-inputs";
import {
	deleteProductWorkflow,
	updateProductWorkflow,
	createProductWorkflow,
} from "@/workflows/products";

function readRequiredString(formData: FormData, key: string) {
	const value = formData.get(key);

	if (typeof value !== "string" || !value.trim()) {
		throw new Error(`缺少字段：${key}`);
	}

	return value;
}

export async function createProductAction(formData: FormData) {
	const input = parseCreateProductFormData(formData);
	const { result } = await createProductWorkflow().run({ input });

	revalidatePath("/");
	revalidatePath("/products");
	revalidatePath("/dashboard");

	redirect(`/dashboard/products/${result.id}`);
}

export async function updateProductAction(formData: FormData) {
	const id = readRequiredString(formData, "id");
	const changes = parseUpdateProductFormData(formData);

	await updateProductWorkflow().run({
		input: { id, changes },
	});

	revalidatePath("/");
	revalidatePath("/products");
	revalidatePath("/dashboard");
	revalidatePath(`/dashboard/products/${id}`);

	redirect(`/dashboard/products/${id}`);
}

export async function deleteProductAction(formData: FormData) {
	const id = readRequiredString(formData, "id");

	await deleteProductWorkflow().run({
		input: { id },
	});

	revalidatePath("/");
	revalidatePath("/products");
	revalidatePath("/dashboard");

	redirect("/dashboard");
}

export async function toggleProductStatusAction(formData: FormData) {
	const id = readRequiredString(formData, "id");
	const status = productStatusSchema.parse(
		readRequiredString(formData, "status"),
	);

	await updateProductWorkflow().run({
		input: {
			id,
			changes: { status },
		},
	});

	revalidatePath("/");
	revalidatePath("/products");
	revalidatePath("/dashboard");
	revalidatePath(`/dashboard/products/${id}`);
}

export async function toggleFeaturedAction(formData: FormData) {
	const id = readRequiredString(formData, "id");
	const featured = readRequiredString(formData, "featured") === "true";

	await updateProductWorkflow().run({
		input: {
			id,
			changes: { featured },
		},
	});

	revalidatePath("/");
	revalidatePath("/products");
	revalidatePath("/dashboard");
	revalidatePath(`/dashboard/products/${id}`);
}
