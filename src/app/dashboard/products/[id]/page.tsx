import { notFound } from "next/navigation";

import {
  deleteProductAction,
  updateProductAction,
} from "@/app/dashboard/actions";
import { Badge } from "@/components/badge";
import { PageFrame } from "@/components/page-frame";
import { ProductForm } from "@/components/product-form";
import { formatCurrency, getProductById } from "@/lib/catalog-service";
import { requireAuth } from "@/lib/auth-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await requireAuth();
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  async function submitUpdateAction(formData: FormData) {
    "use server";

    formData.set("id", id);
    await updateProductAction(formData);
  }

  async function submitDeleteAction() {
    "use server";

    const formData = new FormData();
    formData.set("id", id);
    await deleteProductAction(formData);
  }

  return (
    <PageFrame
      eyebrow="Product Editor"
      title={product.title}
      description="这个页面展示了真正的单体全栈开发体验：Server Component 直接读数据库，提交动作直接调用 workflow。"
      aside={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge tone={product.status === "published" ? "success" : "muted"}>
            {product.status === "published" ? "已发布" : "草稿"}
          </Badge>
          {product.featured ? <Badge>推荐</Badge> : null}
        </div>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <ProductForm
          action={submitUpdateAction}
          submitLabel="保存修改"
          cancelHref="/dashboard"
          helperText="修改将通过 update-product-workflow 落库，并自动刷新首页、商品页和控制台。"
          values={{
            title: product.title,
            description: product.description,
            price: product.price,
            inventory: product.inventory,
            status: product.status,
            featured: product.featured,
          }}
        />

        <div className="space-y-6">
          <article className="rounded-[2rem] border border-white/10 bg-white/6 p-6 text-sm leading-7 text-stone-300/78 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">
              当前信息
            </p>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt>商品 ID</dt>
                <dd className="font-mono text-stone-100">{product.id}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt>Slug</dt>
                <dd className="font-mono text-stone-100">{product.slug}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt>售价</dt>
                <dd className="text-stone-100">
                  {formatCurrency(product.price)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt>库存</dt>
                <dd className="text-stone-100">{product.inventory}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>最后更新时间</dt>
                <dd className="text-stone-100">
                  {new Intl.DateTimeFormat("zh-CN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(product.updatedAt)}
                </dd>
              </div>
            </dl>
          </article>

          <form
            action={submitDeleteAction}
            className="rounded-[2rem] border border-rose-300/10 bg-rose-500/6 p-6 text-sm leading-7 text-rose-100/80"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">
              危险操作
            </p>
            <h2 className="mt-3 font-serif text-3xl text-white">
              删除这件商品
            </h2>
            <p className="mt-3">
              删除动作会走
              delete-product-workflow；如果后续你接入日志、审核或通知，也可以继续挂在同一条
              workflow 上。
            </p>
            <button className="mt-5 rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-950 transition hover:bg-rose-100">
              删除商品
            </button>
          </form>
        </div>
      </section>
    </PageFrame>
  );
}
