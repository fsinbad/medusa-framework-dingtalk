import "server-only";

import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db, ensureDbReady } from "@/db";
import { usersTable, type User } from "@/db/schema";
import { authCookieName, authSecret } from "@/lib/env";

const secret = new TextEncoder().encode(authSecret);

export class UserNotFoundError extends Error {
	constructor(id: string) {
		super(`找不到用户：${id}`);
		this.name = "UserNotFoundError";
	}
}

export function getUserByUnionId(unionId: string) {
	ensureDbReady();
	return db
		.select()
		.from(usersTable)
		.where(eq(usersTable.unionId, unionId))
		.get();
}

export function getUserById(id: string) {
	ensureDbReady();
	return db.select().from(usersTable).where(eq(usersTable.id, id)).get();
}

export function createUserRecord(input: {
	unionId: string;
	openId: string;
	name: string;
	avatar?: string;
	mobile?: string;
	email?: string;
}): User {
	ensureDbReady();

	const timestamp = Date.now();
	const user: User = {
		id: crypto.randomUUID(),
		unionId: input.unionId,
		openId: input.openId,
		name: input.name,
		avatar: input.avatar ?? null,
		mobile: input.mobile ?? null,
		email: input.email ?? null,
		createdAt: timestamp,
		updatedAt: timestamp,
	};

	db.insert(usersTable).values(user).run();
	return user;
}

export function updateUserRecord(
	id: string,
	input: Partial<Pick<User, "name" | "avatar" | "mobile" | "email">>,
) {
	ensureDbReady();

	const existing = getUserById(id);
	if (!existing) throw new UserNotFoundError(id);

	const updated: User = {
		...existing,
		name: input.name === undefined ? existing.name : input.name,
		avatar: input.avatar === undefined ? existing.avatar : input.avatar,
		mobile: input.mobile === undefined ? existing.mobile : input.mobile,
		email: input.email === undefined ? existing.email : input.email,
		updatedAt: Date.now(),
	};

	db.update(usersTable)
		.set({
			name: updated.name,
			avatar: updated.avatar,
			mobile: updated.mobile,
			email: updated.email,
			updatedAt: updated.updatedAt,
		})
		.where(eq(usersTable.id, id))
		.run();

	return updated;
}

export function restoreUserRecord(user: User) {
	ensureDbReady();
	db.insert(usersTable)
		.values(user)
		.onConflictDoUpdate({ target: usersTable.id, set: user })
		.run();
	return user;
}

export function deleteUserRecord(id: string) {
	ensureDbReady();
	const existing = getUserById(id);
	if (!existing) {
		throw new UserNotFoundError(id);
	}
	db.delete(usersTable).where(eq(usersTable.id, id)).run();
	return existing;
}

export async function signSessionToken(userId: string) {
	return new SignJWT({ userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(secret);
}

export async function verifySessionToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret, {
			clockTolerance: 60,
		});
		return payload.userId as string;
	} catch {
		return null;
	}
}

export async function getSessionUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(authCookieName)?.value;

	if (!token) return null;

	const userId = await verifySessionToken(token);
	if (!userId) return null;

	return getUserById(userId) ?? null;
}

export async function requireAuth(): Promise<User> {
	const user = await getSessionUser();
	if (!user) {
		redirect("/auth/login");
	}
	return user;
}

export async function setSessionCookie(token: string) {
	const cookieStore = await cookies();
	cookieStore.set(authCookieName, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	});
}

export async function clearSessionCookie() {
	const cookieStore = await cookies();
	cookieStore.set(authCookieName, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});
}
