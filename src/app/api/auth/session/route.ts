import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth-service";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }

  return NextResponse.json({ data: user });
}
