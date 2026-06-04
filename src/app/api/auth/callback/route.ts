import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { dingTalkAuthWorkflow } from "@/workflows/auth";
import {
	getDingTalkUserAccessToken,
	getDingTalkUserInfo,
} from "@/lib/dingtalk-api";
import { setSessionCookie, signSessionToken } from "@/lib/auth-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const authCode = searchParams.get("authCode");
	const state = searchParams.get("state");

	const cookieStore = await cookies();
	const expectedState = cookieStore.get("oauth_state")?.value;

	if (!authCode) {
		return NextResponse.json({ error: "缺少授权码" }, { status: 400 });
	}

	if (!state || state !== expectedState) {
		return NextResponse.json({ error: "非法的 state 参数" }, { status: 403 });
	}

	cookieStore.set("oauth_state", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});

	try {
		const userAccessToken = await getDingTalkUserAccessToken(authCode);
		const userInfo = await getDingTalkUserInfo(userAccessToken);

		if (!userInfo.unionId || !userInfo.openId || !userInfo.nick) {
			return NextResponse.json(
				{ error: "无法获取钉钉用户信息" },
				{ status: 500 },
			);
		}

		const { result } = await dingTalkAuthWorkflow().run({
			input: {
				unionId: userInfo.unionId,
				openId: userInfo.openId,
				name: userInfo.nick,
				avatar: userInfo.avatarUrl,
				mobile: userInfo.mobile,
				email: userInfo.email,
			},
		});

		const token = await signSessionToken(result.id);
		await setSessionCookie(token);

		return NextResponse.redirect(new URL("/dashboard", request.url));
	} catch (error) {
		const message = error instanceof Error ? error.message : "未知错误";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
