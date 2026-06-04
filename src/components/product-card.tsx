import Link from "next/link";

import { Badge } from "@/components/badge";
import { formatCurrency } from "@/lib/catalog-service";
import type { Product } from "@/db/schema";

type ProductCardProps = {
  product: Product;
  editable?: boolean;
};

export function ProductCard({ product, editable = false }: ProductCardProps) {
  return (
    <article className="rounded-[1.8rem] border border-white/10 bg-stone-950/55 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/45">{product.slug}</p>
          <h3 className="mt-3 font-serif text-2xl text-white">{product.title}</h3>
        </div>
        <Badge tone={product.status === "published" ? "success" : "muted"}>
          {product.status === "published" ? "已发布" : "草稿"}
        </Badge>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-stone-300/78">
        {product.description}
      </p>
      <div className="mt-6 grid gap-4 rounded-[1.4rem] border border-white/8 bg-white/5 p-4 text-sm text-stone-300/78 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">价格</p>
          <p className="mt-2 text-lg text-white">{formatCurrency(product.price)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">库存</p>
          <p className="mt-2 text-lg text-white">{product.inventory}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">推荐</p>
          <p className="mt-2 text-lg text-white">{product.featured ? "是" : "否"}</p>
        </div>
      </div>
      {editable ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-sm text-stone-400">在控制台里继续编辑商品详情。</span>
          <Link
            href={`/dashboard/products/${product.id}`}
            className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-100/8 px-4 py-2 text-sm font-medium text-amber-50 transition hover:border-amber-200/35 hover:bg-amber-100/14"
          >
            编辑商品
          </Link>
        </div>
      ) : null}
    </article>
  );
}
