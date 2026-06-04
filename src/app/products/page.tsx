import { PageFrame } from "@/components/page-frame";
import { ProductCard } from "@/components/product-card";
import { listProducts } from "@/lib/catalog-service";
import type { ProductStatus } from "@/lib/catalog-inputs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: ProductStatus | "all";
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = params.status ?? "all";
  const products = listProducts({
    query: query || undefined,
    status,
  });

  return (
    <PageFrame
      eyebrow="Storefront"
      title="同一个 Next 应用里，既有前台商品页，也有后台管理页。"
      description="这个列表页直接读取 SQLite 文件数据库，没有单独的 storefront 服务，也没有拆出来的后端 API 服务器。"
      aside={
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-stone-300/78">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">当前筛选</p>
          <p className="mt-2">状态：{status === "all" ? "全部" : status === "published" ? "已发布" : "草稿"}</p>
          <p className="mt-1">关键词：{query || "未填写"}</p>
        </div>
      }
    >
      <form className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-6 sm:grid-cols-[1fr_180px_120px]">
        <input
          name="q"
          defaultValue={query}
          placeholder="搜索标题、slug 或描述"
          className="rounded-2xl border border-white/12 bg-stone-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-300/40"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-2xl border border-white/12 bg-stone-950/70 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/40"
        >
          <option value="all">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-amber-200 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100"
        >
          搜索
        </button>
      </form>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {products.length ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/4 p-8 text-sm text-stone-400 lg:col-span-2 xl:col-span-3">
            没有匹配的商品，试着换一个关键词，或者到控制台里新建一件商品。
          </div>
        )}
      </section>
    </PageFrame>
  );
}
