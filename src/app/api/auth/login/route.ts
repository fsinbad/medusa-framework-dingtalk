import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { dingTalkClientId, dingTalkRedirectUri } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  const params = new URLSearchParams({
    redirect_uri: dingTalkRedirectUri,
    response_type: "code",
    client_id: dingTalkClientId,
    scope: "openid",
    state,
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://login.dingtalk.com/oauth2/auth?${params.toString()}`,
  );
}
