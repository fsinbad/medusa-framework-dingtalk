import Link from "next/link";

import type { ProductStatus } from "@/lib/catalog-inputs";

type ProductFormValues = {
  title: string;
  description: string;
  price: number;
  inventory: number;
  status: ProductStatus;
  featured: boolean;
};

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  values?: Partial<ProductFormValues>;
  helperText?: string;
  cancelHref?: string;
};

const defaultValues: ProductFormValues = {
  title: "",
  description: "",
  price: 12900,
  inventory: 10,
  status: "draft",
  featured: false,
};

function fieldClassName() {
  return "mt-2 w-full rounded-2xl border border-white/12 bg-stone-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/40 focus:bg-stone-950";
}

export function ProductForm({
  action,
  submitLabel,
  values,
  helperText,
  cancelHref,
}: ProductFormProps) {
  const merged = { ...defaultValues, ...values };

  return (
    <form action={action} className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div>
        <label className="text-sm font-medium text-stone-200" htmlFor="title">
          商品标题
        </label>
        <input
          id="title"
          name="title"
          defaultValue={merged.title}
          className={fieldClassName()}
          placeholder="例如：铜色桌面收纳架"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-200" htmlFor="description">
          商品描述
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={merged.description}
          className={`${fieldClassName()} min-h-32 resize-y`}
          placeholder="写清楚卖点、材质、适用场景和交付方式。"
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-200" htmlFor="price">
            售价（分）
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={100}
            step={100}
            defaultValue={merged.price}
            className={fieldClassName()}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-200" htmlFor="inventory">
            库存
          </label>
          <input
            id="inventory"
            name="inventory"
            type="number"
            min={0}
            step={1}
            defaultValue={merged.inventory}
            className={fieldClassName()}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <label className="text-sm font-medium text-stone-200" htmlFor="status">
            发布状态
          </label>
          <select
            id="status"
            name="status"
            defaultValue={merged.status}
            className={fieldClassName()}
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>

        <label className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-stone-950/50 px-4 py-3 text-sm text-stone-200 md:mt-8">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={merged.featured}
            className="h-4 w-4 rounded border-white/20 bg-transparent text-amber-300 focus:ring-amber-300"
          />
          设为首页推荐商品
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100"
        >
          {submitLabel}
        </button>
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-stone-200 transition hover:border-white/25 hover:bg-white/6"
          >
            返回
          </Link>
        ) : null}
      </div>

      {helperText ? <p className="text-sm leading-6 text-stone-400">{helperText}</p> : null}
    </form>
  );
}
