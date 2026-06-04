import Link from "next/link";

import { Badge } from "@/components/badge";
import { MetricCard } from "@/components/metric-card";
import { ProductCard } from "@/components/product-card";
import { getDashboardStats, getFeaturedProducts, formatCurrency } from "@/lib/catalog-service";
import { databaseFileLabel } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function HomePage() {
  const stats = getDashboardStats();
  const featuredProducts = getFeaturedProducts(3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-14 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div className="rounded-[2.25rem] border border-white/10 bg-white/6 p-8 shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-10">
          <Badge>Single app / full stack</Badge>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight text-white sm:text-6xl">
            用 Next.js 做界面，用 SQLite 落地数据，用 Medusa Workflow 管业务动作。
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300/78">
            这是一个按你要求搭的“前后端不分家”单体全栈模板：页面、表单、API、数据库和业务编排都在同一仓库内。
            其中 <code className="rounded bg-white/8 px-2 py-1 font-mono text-sm">@medusajs/framework</code>{" "}
            被用于工作流编排层，而数据持久化则使用 SQLite 文件库。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100"
            >
              打开控制台
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-stone-100 transition hover:border-white/24 hover:bg-white/6"
            >
              浏览商品
            </Link>
          </div>
          <dl className="mt-10 grid gap-5 rounded-[1.8rem] border border-white/10 bg-stone-950/40 p-6 text-sm text-stone-300/78 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.24em] text-stone-500">数据库文件</dt>
              <dd className="mt-3 font-mono text-stone-100">{databaseFileLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.24em] text-stone-500">库存估值</dt>
              <dd className="mt-3 font-mono text-stone-100">
                {formatCurrency(stats.inventoryValue)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.24em] text-stone-500">推荐商品</dt>
              <dd className="mt-3 font-mono text-stone-100">{stats.featuredCount} 件</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-4">
          <MetricCard
            label="商品总数"
            value={`${stats.productCount}`}
            detail="首页、控制台和 API 共享同一套 SQLite 数据。"
          />
          <MetricCard
            label="已发布"
            value={`${stats.publishedCount}`}
            detail="通过 Medusa Workflow 驱动的更新动作即时切换上下架状态。"
          />
          <MetricCard
            label="总库存"
            value={`${stats.totalInventory}`}
            detail="适合继续扩展订单、仓储、会员等更多单体业务模块。"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[1.8rem] border border-white/10 bg-white/6 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">1 / 界面层</p>
          <h2 className="mt-4 font-serif text-2xl text-white">Next.js App Router</h2>
          <p className="mt-3 text-sm leading-7 text-stone-300/78">
            首页、商品页、后台控制台和编辑页都在同一个 Next 应用里，天然就是一个全栈单体。
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-white/10 bg-white/6 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">2 / 业务层</p>
          <h2 className="mt-4 font-serif text-2xl text-white">Medusa Workflows</h2>
          <p className="mt-3 text-sm leading-7 text-stone-300/78">
            创建、更新、删除商品全部走 workflow，后续你可以很自然地插入审计、通知、日志或补偿逻辑。
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-white/10 bg-white/6 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">3 / 数据层</p>
          <h2 className="mt-4 font-serif text-2xl text-white">SQLite + Drizzle</h2>
          <p className="mt-3 text-sm leading-7 text-stone-300/78">
            数据库文件保存在本地 <span className="font-mono">data/</span> 目录，适合原型、轻量后台和私有部署。
          </p>
        </article>
      </section>

      <section className="grid gap-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">精选商品</p>
            <h2 className="mt-3 font-serif text-4xl text-white">内置种子数据，可直接开始改造</h2>
          </div>
          <Link href="/products" className="text-sm text-stone-300 transition hover:text-white">
            查看全部商品 →
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
