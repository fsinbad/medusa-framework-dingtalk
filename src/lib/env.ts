import path from "node:path";

const defaultRelativeDatabasePath = "data/medusa-monolith.sqlite";

export const databaseFilePath = process.env.DATABASE_FILE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_FILE_PATH)
  : path.join(process.cwd(), defaultRelativeDatabasePath);

export const databaseFileLabel =
  path.relative(process.cwd(), databaseFilePath) || defaultRelativeDatabasePath;

export const dingTalkClientId = process.env.DINGTALK_CLIENT_ID ?? "";
export const dingTalkClientSecret = process.env.DINGTALK_CLIENT_SECRET ?? "";
export const dingTalkRedirectUri =
  process.env.DINGTALK_REDIRECT_URI ??
  "http://localhost:3000/api/auth/callback";
export const authSecret =
  process.env.AUTH_SECRET ?? "development-secret-change-me";
export const authCookieName = process.env.AUTH_COOKIE_NAME ?? "session";

if (!dingTalkClientId || !dingTalkClientSecret) {
  console.warn(
    "[env] DINGTALK_CLIENT_ID 或 DINGTALK_CLIENT_SECRET 未配置，钉钉登录将不可用",
  );
}

if (authSecret === "development-secret-change-me") {
  console.warn("[env] AUTH_SECRET 使用默认值，生产环境请设置强密钥");
}
