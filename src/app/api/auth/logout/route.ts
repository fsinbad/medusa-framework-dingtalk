import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/auth-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
	await clearSessionCookie();
	return NextResponse.redirect(new URL("/", request.url), 303);
}
