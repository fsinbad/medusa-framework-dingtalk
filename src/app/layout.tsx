import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";

import { getSessionUser } from "@/lib/auth-service";
import { logoutAction } from "@/app/auth/actions";

import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const displayFont = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Medusa Monolith Starter",
  description:
    "基于 Next.js + Tailwind + SQLite 的单体全栈模板，用 @medusajs/framework workflow 驱动业务编排。",
};

const links = [
  { href: "/", label: "首页" },
  { href: "/products", label: "商品" },
  { href: "/dashboard", label: "控制台" },
  { href: "/api/products", label: "API" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html
      lang="zh-CN"
      className={`${bodyFont.variable} ${monoFont.variable} ${displayFont.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,203,150,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_22%)]" />
          <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-8 sm:px-6 lg:px-8">
            <header className="sticky top-0 z-20 border-b border-white/8 bg-background/80 backdrop-blur-xl">
              <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-2 py-4">
                <Link href="/" className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.26em] text-amber-100/55">
                    medusa monolith
                  </span>
                  <span className="font-serif text-2xl text-white">
                    Next + SQLite Starter
                  </span>
                </Link>
                <nav className="hidden items-center gap-2 md:flex">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/6 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user ? (
                    <form action={logoutAction} className="inline">
                      <button className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/6 hover:text-white">
                        退出 ({user.name})
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/6 hover:text-white"
                    >
                      登录
                    </Link>
                  )}
                </nav>
              </div>
            </header>
            <main className="flex flex-1 flex-col">{children}</main>
            <footer className="mt-auto border-t border-white/8 px-2 py-6 text-sm text-stone-400">
              单仓单应用、Node 运行时、SQLite 文件数据库、Medusa Workflow 编排。
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
