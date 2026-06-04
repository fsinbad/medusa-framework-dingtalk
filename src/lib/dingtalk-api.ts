import "server-only";

import { dingTalkClientId, dingTalkClientSecret } from "@/lib/env";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getDingTalkAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch("https://api.dingtalk.com/v1.0/oauth2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appKey: dingTalkClientId,
      appSecret: dingTalkClientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`获取钉钉 accessToken 失败: ${res.status}`);
  }

  const data = (await res.json()) as {
    accessToken?: string;
    expireIn?: number;
  };

  if (!data.accessToken) {
    throw new Error("钉钉 accessToken 响应缺少 token");
  }

  cachedToken = {
    token: data.accessToken,
    expiresAt: Date.now() + (data.expireIn ?? 7200) * 1000 - 5 * 60 * 1000,
  };

  return data.accessToken;
}

type UserAccessTokenResponse = {
  accessToken?: string;
  refreshToken?: string;
  expireIn?: number;
};

export async function getDingTalkUserAccessToken(authCode: string) {
  const res = await fetch(
    "https://api.dingtalk.com/v1.0/oauth2/userAccessToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: dingTalkClientId,
        clientSecret: dingTalkClientSecret,
        code: authCode,
        grantType: "authorization_code",
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`换取钉钉 userAccessToken 失败: ${res.status}`);
  }

  const data = (await res.json()) as UserAccessTokenResponse;

  if (!data.accessToken) {
    throw new Error("钉钉 userAccessToken 响应缺少 token");
  }

  return data.accessToken;
}

type DingTalkUserInfo = {
  nick?: string;
  unionId?: string;
  avatarUrl?: string;
  openId?: string;
  mobile?: string;
  email?: string;
};

export async function getDingTalkUserInfo(
  userAccessToken: string,
): Promise<DingTalkUserInfo> {
  const res = await fetch("https://api.dingtalk.com/v1.0/contact/users/me", {
    method: "GET",
    headers: {
      "x-acs-dingtalk-access-token": userAccessToken,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`获取钉钉用户信息失败: ${res.status}`);
  }

  return (await res.json()) as DingTalkUserInfo;
}
