import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { listProducts } from "@/lib/catalog-service";
import { parseCreateProductJson } from "@/lib/catalog-inputs";
import { createProductWorkflow } from "@/workflows/products";
import { getSessionUser } from "@/lib/auth-service";

export const runtime = "nodejs";

function toErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "请求参数校验失败",
        issues: error.issues,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "未知错误",
    },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || undefined;
  const statusParam = searchParams.get("status");
  const featuredParam = searchParams.get("featured");

  const status =
    statusParam === "draft" ||
    statusParam === "published" ||
    statusParam === "all"
      ? statusParam
      : "all";

  const products = listProducts({
    query: q,
    status,
    featured: featuredParam ? featuredParam === "true" : undefined,
  });

  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = parseCreateProductJson(body);
    const { result } = await createProductWorkflow().run({ input });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
