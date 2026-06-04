"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { clearSessionCookie } from "@/lib/auth-service";

export async function logoutAction() {
	await clearSessionCookie();
	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/products");
	redirect("/");
}
