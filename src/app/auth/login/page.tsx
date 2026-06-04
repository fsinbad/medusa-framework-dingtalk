import Link from "next/link";

import { PageFrame } from "@/components/page-frame";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function LoginPage() {
  return (
    <PageFrame
      eyebrow="Authentication"
      title="使用钉钉登录"
      description="点击下方按钮，通过钉钉 OAuth 授权登录。"
    >
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6">
        <Link
          href="/api/auth/login"
          className="inline-flex items-center rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100"
        >
          使用钉钉登录
        </Link>
        <p className="text-sm text-stone-400">
          登录即表示同意通过钉钉账号授权访问本应用
        </p>
      </div>
    </PageFrame>
  );
}
