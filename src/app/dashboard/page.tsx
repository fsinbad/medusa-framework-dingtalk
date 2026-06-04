import Link from "next/link";

import { Badge } from "@/components/badge";
import { MetricCard } from "@/components/metric-card";
import { PageFrame } from "@/components/page-frame";
import { ProductForm } from "@/components/product-form";
import {
  createProductAction,
  toggleFeaturedAction,
  toggleProductStatusAction,
} from "@/app/dashboard/actions";
import {
  formatCurrency,
  getDashboardStats,
  listProducts,
} from "@/lib/catalog-service";
import { requireAuth } from "@/lib/auth-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  await requireAuth();
  const stats = getDashboardStats();
  const products = listProducts();

  return (
    <PageFrame
      eyebrow="Control Panel"
      title="后台与前台共用同一套页面路由和数据库。"
      description="新增、上下架、推荐与删除操作都直接发生在当前 Next 应用内部，并通过 Medusa Workflow 执行业务逻辑。"
      aside={<Badge>CRUD + JSON API</Badge>}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="商品数量"
          value={`${stats.productCount}`}
          detail="新建商品会自动生成 slug，并写入 SQLite 文件。"
        />
        <MetricCard
          label="已发布"
          value={`${stats.publishedCount}`}
          detail="发布态商品会显示在前台商品页与首页精选位。"
        />
        <MetricCard
          label="推荐位"
          value={`${stats.featuredCount}`}
          detail="推荐开关可用于首页 hero、专题页或运营位。"
        />
        <MetricCard
          label="库存估值"
          value={formatCurrency(stats.inventoryValue)}
          detail="可以在这里继续扩展订单、采购、仓储规则。"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <ProductForm
            action={createProductAction}
            submitLabel="创建商品"
            helperText="提交后会跳转到详情编辑页。输入会先经过 Zod 校验，再交给 Medusa Workflow 创建商品。"
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 text-sm leading-7 text-stone-300/78">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">
              JSON API
            </p>
            <ul className="mt-4 space-y-2 font-mono text-xs text-stone-300">
              <li>GET /api/products</li>
              <li>POST /api/products</li>
              <li>GET /api/products/:id</li>
              <li>PATCH /api/products/:id</li>
              <li>DELETE /api/products/:id</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">
                最近更新
              </p>
              <h2 className="mt-3 font-serif text-3xl text-white">商品管理</h2>
            </div>
            <span className="text-sm text-stone-400">
              共 {products.length} 条记录
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-[1.6rem] border border-white/8 bg-stone-950/55 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      {product.slug}
                    </p>
                    <h3 className="mt-3 text-xl text-white">{product.title}</h3>
                    <p className="mt-2 text-sm text-stone-300/78">
                      {formatCurrency(product.price)} · 库存 {product.inventory}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      tone={
                        product.status === "published" ? "success" : "muted"
                      }
                    >
                      {product.status === "published" ? "已发布" : "草稿"}
                    </Badge>
                    {product.featured ? <Badge>推荐</Badge> : null}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="rounded-full border border-white/12 px-4 py-2 text-sm text-stone-200 transition hover:border-white/24 hover:bg-white/6"
                  >
                    编辑
                  </Link>

                  <form action={toggleProductStatusAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        product.status === "published" ? "draft" : "published"
                      }
                    />
                    <button className="rounded-full border border-white/12 px-4 py-2 text-sm text-stone-200 transition hover:border-white/24 hover:bg-white/6">
                      {product.status === "published" ? "转草稿" : "立即发布"}
                    </button>
                  </form>

                  <form action={toggleFeaturedAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input
                      type="hidden"
                      name="featured"
                      value={product.featured ? "false" : "true"}
                    />
                    <button className="rounded-full border border-amber-300/18 px-4 py-2 text-sm text-amber-100 transition hover:border-amber-200/35 hover:bg-amber-100/10">
                      {product.featured ? "取消推荐" : "设为推荐"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
